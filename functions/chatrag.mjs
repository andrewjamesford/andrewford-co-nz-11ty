import dotenv from "dotenv";
dotenv.config();

import sanitizeHtml from "sanitize-html";

// Note: FaissStore operations moved to local-only generateVectorStore.mjs
// This function now works with pre-computed embeddings or alternative approach
// LangChain imports moved to dynamic imports to avoid ES module issues

// Simple document collection for demo purposes
// In production, you would load this from a pre-computed file or database
const SAMPLE_DOCUMENTS = [
  new Document({
    pageContent: "Andrew Ford is a software developer and blogger. He writes about technology, programming, and software development on his blog.",
    metadata: { source: "/about/", slug: "about" }
  }),
  new Document({
    pageContent: "This blog contains articles about web development, JavaScript, TypeScript, React, and other programming topics.",
    metadata: { source: "/articles/", slug: "articles" }
  })
];

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

  // Basic content validation - ensure it's not just special characters
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

export const handler = async (event, context) => {
  // Enable streaming for Netlify Functions
  if (event.headers.accept?.includes("text/event-stream")) {
    return streamHandler(event, context);
  }

  // Fallback to non-streaming response
  return nonStreamHandler(event, context);
};

const streamHandler = async (event, context) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

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

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    const vectorStore = await MemoryVectorStore.fromDocuments(SAMPLE_DOCUMENTS, embeddings);
    const retriever = vectorStore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant for Andrew Ford's blog. Answer the following question based on the provided context from the blog posts.
      
      If you cannot find the answer in the provided context, politely say that you don't have that information in the blog posts.
      
      Context from blog posts:
      {context}
      
      Question: {input}
      
      Answer:
    `);

    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    // Get the context first
    const docs = await retriever.getRelevantDocuments(sanitizedQuestion);

    // Process sources
    let sources = [];
    const siteUrl = (
      process.env.SITE_URL || "https://andrewford.co.nz"
    ).replace(/\/$/, "");
    if (Array.isArray(docs)) {
      const links = docs.map((doc) => {
        const slugMatch = doc.pageContent.match(/slug:\s*"?([^"\n]+)"?/);
        let slug;
        if (slugMatch) {
          slug = slugMatch[1];
          if (doc.metadata?.source && !slug.includes("/")) {
            const sourcePath = doc.metadata.source;
            if (sourcePath.includes("/articles/")) {
              slug = "articles/" + slug;
            }
          }
          if (!slug.startsWith("/")) slug = "/" + slug;
          if (!slug.endsWith("/") && slug.includes("/")) {
            slug = slug + "/";
          }
        } else if (doc.metadata?.source) {
          const rel = doc.metadata.source.split("/content/")[1] || "";
          slug = rel.replace(/index\.md$/, "").replace(/\.md$/, "");
          if (slug && !slug.endsWith("/") && slug.includes("/")) {
            slug = slug + "/";
          }
          if (!slug.startsWith("/")) slug = "/" + slug;
        } else {
          slug = "";
        }
        return siteUrl + slug;
      });
      const uniqueLinks = [...new Set(links)];
      sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];
    }

    // Stream the response
    const stream = await retrievalChain.stream({
      input: sanitizedQuestion,
    });

    let fullResponse = "";
    const chunks = [];

    for await (const chunk of stream) {
      if (chunk.answer) {
        fullResponse += chunk.answer;
        chunks.push(`data: ${JSON.stringify({ chunk: chunk.answer })}\n\n`);
      }
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
        body: JSON.stringify({ error: sanitizeError.message }),
      };
    }

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    const vectorStore = await MemoryVectorStore.fromDocuments(SAMPLE_DOCUMENTS, embeddings);
    const retriever = vectorStore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant for Andrew Ford's blog. Answer the following question based on the provided context from the blog posts.
      
      If you cannot find the answer in the provided context, politely say that you don't have that information in the blog posts.
      
      Context from blog posts:
      {context}
      
      Question: {input}
      
      Answer:
    `);

    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    const response = await retrievalChain.invoke({
      input: sanitizedQuestion, // Use sanitized input
    });

    let sources = [];
    const siteUrl = (
      process.env.SITE_URL || "https://andrewford.co.nz"
    ).replace(/\/$/, "");
    if (Array.isArray(response.context)) {
      const links = response.context.map((doc) => {
        const slugMatch = doc.pageContent.match(/slug:\s*"?([^"\n]+)"?/);
        let slug;
        if (slugMatch) {
          slug = slugMatch[1];
          // If slug from frontmatter doesn't include section path, try to infer it from metadata
          if (doc.metadata?.source && !slug.includes("/")) {
            const sourcePath = doc.metadata.source;
            if (sourcePath.includes("/articles/")) {
              slug = "articles/" + slug;
            }
          }
          // Ensure slug has proper format
          if (!slug.startsWith("/")) slug = "/" + slug;
          if (!slug.endsWith("/") && slug.includes("/")) {
            slug = slug + "/";
          }
        } else if (doc.metadata?.source) {
          const rel = doc.metadata.source.split("/content/")[1] || "";
          slug = rel.replace(/index\.md$/, "").replace(/\.md$/, "");
          // Ensure trailing slash for directory-based articles
          if (slug && !slug.endsWith("/") && slug.includes("/")) {
            slug = slug + "/";
          }
          if (!slug.startsWith("/")) slug = "/" + slug;
        } else {
          slug = "";
        }

        return siteUrl + slug;
      });
      const uniqueLinks = [...new Set(links)];
      // Return only the top result
      sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];
    }

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
        answer: response.answer,
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
