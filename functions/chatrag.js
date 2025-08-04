const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const sanitizeHtml = require("sanitize-html");
const { findSimilarDocuments } = require("./vectorSearch");

// Load pre-computed vector store
let VECTOR_STORE = null;

function loadVectorStore() {
  if (VECTOR_STORE) return VECTOR_STORE;
  
  try {
    const vectorStorePath = path.join(__dirname, "../vector_store/simple_vector_store.json");
    const vectorStoreContent = fs.readFileSync(vectorStorePath, "utf-8");
    VECTOR_STORE = JSON.parse(vectorStoreContent);
    console.log(`Loaded ${VECTOR_STORE.documents.length} documents from vector store`);
    return VECTOR_STORE;
  } catch (error) {
    console.error("Error loading vector store:", error);
    // Return empty store if file doesn't exist
    return { documents: [] };
  }
}

// Input sanitization configuration
const INPUT_LIMITS = {
  maxLength: 500,
  minLength: 10,
};

function sanitizeInput(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  // Trim whitespace
  const trimmed = input.trim();

  // Check length limits
  if (trimmed.length < INPUT_LIMITS.minLength) {
    throw new Error(
      `Question must be at least ${INPUT_LIMITS.minLength} characters long`
    );
  }

  if (trimmed.length > INPUT_LIMITS.maxLength) {
    throw new Error(
      `Question must be no more than ${INPUT_LIMITS.maxLength} characters long`
    );
  }

  // Sanitize input using sanitize-html with stricter text filtering
  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: [], // Disallow all HTML tags
    allowedAttributes: {}, // Disallow all attributes
    textFilter: function (text) {
      // Only allow text that contains alphanumeric characters
      if (!/[a-zA-Z0-9]/.test(text)) {
        return ""; // Return empty string for invalid content
      }
      return text;
    },
  });

  // Check if sanitization resulted in empty content
  if (!sanitized || sanitized.trim().length === 0) {
    throw new Error("Question must contain alphanumeric characters");
  }

  return sanitized;
}

exports.handler = async (event, context) => {
  // Enable streaming for Netlify Functions
  if (event.headers.accept?.includes("text/event-stream")) {
    return streamHandler(event, context);
  }

  // Fallback to non-streaming response
  return nonStreamHandler(event, context);
};

const streamHandler = async (event, context) => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { question } = body;

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: `data: ${JSON.stringify({ error: "Question is required" })}\n\n`,
      };
    }

    // Sanitize the input
    let sanitizedQuestion;
    try {
      sanitizedQuestion = sanitizeInput(question);
    } catch (sanitizeError) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: `data: ${JSON.stringify({ error: sanitizeError.message })}\n\n`,
      };
    }

    // Load vector store
    const vectorStore = loadVectorStore();
    
    if (!vectorStore.documents || vectorStore.documents.length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: `data: ${JSON.stringify({ 
          chunk: "I'm sorry, but the knowledge base is not available at the moment. Please try again later.",
          done: true,
          sources: []
        })}\n\n`,
      };
    }

    // Generate embedding for the question (this is the only API call for embeddings)
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const queryEmbedding = await embeddings.embedQuery(sanitizedQuestion);

    // Find similar documents using pre-computed embeddings
    const similarDocs = findSimilarDocuments(queryEmbedding, vectorStore.documents, 4);

    // Initialize LLM
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      model:
        process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.SITE_URL || "https://andrewford.co.nz",
          "X-Title": "Andrew Ford Blog Chatbot",
        },
      },
      streaming: true,
    });

    // Create context from similar documents
    const context = similarDocs
      .map(doc => doc.pageContent)
      .join("\n\n---\n\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant for Andrew Ford's blog. Answer the following question based on the provided context from the blog posts.
      
      If you cannot find the answer in the provided context, politely say that you don't have that information in the blog posts.
      
      Context from blog posts:
      {context}
      
      Question: {input}
      
      Answer:
    `);

    const formattedPrompt = await prompt.format({
      context: context,
      input: sanitizedQuestion
    });

    // Stream the response
    const stream = await llm.stream(formattedPrompt);

    // Process sources
    let sources = [];
    const siteUrl = (
      process.env.SITE_URL || "https://andrewford.co.nz"
    ).replace(/\/$/, "");
    
    const links = similarDocs.map((doc) => {
      if (doc.metadata?.source) {
        const rel = doc.metadata.source.split("/content/")[1] || "";
        let slug = rel.replace(/index\.md$/, "").replace(/\.md$/, "");
        if (slug && !slug.endsWith("/") && slug.includes("/")) {
          slug = slug + "/";
        }
        if (!slug.startsWith("/")) slug = "/" + slug;
        return siteUrl + slug;
      }
      return siteUrl;
    });
    const uniqueLinks = [...new Set(links)];
    sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];

    let fullResponse = "";
    const chunks = [];

    for await (const chunk of stream) {
      fullResponse += chunk.content;
      chunks.push(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`);
    }

    // Send the complete response with sources at the end
    chunks.push(`data: ${JSON.stringify({ done: true, sources })}\n\n`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin":
          event.headers.origin || "https://andrewford.co.nz",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: chunks.join(""),
    };
  } catch (error) {
    console.error("Error processing streaming request:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin":
          event.headers.origin || "https://andrewford.co.nz",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: `data: ${JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      })}\n\n`,
    };
  }
};

const nonStreamHandler = async (event, context) => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { question } = body;

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({ error: "Question is required" }),
      };
    }

    // Sanitize the input
    let sanitizedQuestion;
    try {
      sanitizedQuestion = sanitizeInput(question);
    } catch (sanitizeError) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({ error: sanitizeError.message }),
      };
    }

    // Load vector store
    const vectorStore = loadVectorStore();
    
    if (!vectorStore.documents || vectorStore.documents.length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({
          answer: "I'm sorry, but the knowledge base is not available at the moment. Please try again later.",
          sources: []
        }),
      };
    }

    // Generate embedding for the question (this is the only API call for embeddings)
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const queryEmbedding = await embeddings.embedQuery(sanitizedQuestion);

    // Find similar documents using pre-computed embeddings
    const similarDocs = findSimilarDocuments(queryEmbedding, vectorStore.documents, 4);

    // Initialize LLM
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      model:
        process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.SITE_URL || "https://andrewford.co.nz",
          "X-Title": "Andrew Ford Blog Chatbot",
        },
      },
    });

    // Create context from similar documents
    const context = similarDocs
      .map(doc => doc.pageContent)
      .join("\n\n---\n\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant for Andrew Ford's blog. Answer the following question based on the provided context from the blog posts.
      
      If you cannot find the answer in the provided context, politely say that you don't have that information in the blog posts.
      
      Context from blog posts:
      {context}
      
      Question: {input}
      
      Answer:
    `);

    const formattedPrompt = await prompt.format({
      context: context,
      input: sanitizedQuestion
    });

    const response = await llm.invoke(formattedPrompt);

    // Process sources
    let sources = [];
    const siteUrl = (
      process.env.SITE_URL || "https://andrewford.co.nz"
    ).replace(/\/$/, "");
    
    const links = similarDocs.map((doc) => {
      if (doc.metadata?.source) {
        const rel = doc.metadata.source.split("/content/")[1] || "";
        let slug = rel.replace(/index\.md$/, "").replace(/\.md$/, "");
        if (slug && !slug.endsWith("/") && slug.includes("/")) {
          slug = slug + "/";
        }
        if (!slug.startsWith("/")) slug = "/" + slug;
        return siteUrl + slug;
      }
      return siteUrl;
    });
    const uniqueLinks = [...new Set(links)];
    sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["https://andrewford.co.nz"];
    const origin = event.headers.origin;
    const allowOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({
        answer: response.content,
        sources,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

    // Handle specific OpenRouter errors
    if (error.response?.status === 401) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({
          error: "Authentication error. Please check API configuration.",
        }),
      };
    }

    if (error.response?.status === 429) {
      return {
        statusCode: 429,
        headers: {
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({
          error: "Model rate limit reached. Please try again later.",
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin":
          event.headers.origin || "https://andrewford.co.nz",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
    };
  }
};