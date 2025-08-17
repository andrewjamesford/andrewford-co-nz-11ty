import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import express from "express";
import sanitizeHtml from "sanitize-html";
import { findSimilarDocuments } from "../utils/vectorSearch.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let VECTOR_STORE = null;

function loadVectorStore() {
  if (VECTOR_STORE) return VECTOR_STORE;

  try {
    const vectorStorePath = path.join(
      __dirname,
      "../../vector_store/simple_vector_store.json"
    );
    const vectorStoreContent = fs.readFileSync(vectorStorePath, "utf-8");
    VECTOR_STORE = JSON.parse(vectorStoreContent);
    console.log(
      `Loaded ${VECTOR_STORE.documents.length} documents from vector store`
    );
    return VECTOR_STORE;
  } catch (error) {
    console.error("Error loading vector store:", error);
    return { documents: [] };
  }
}

const INPUT_LIMITS = {
  maxLength: 500,
  minLength: 10,
};

function sanitizeInput(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  const trimmed = input.trim();

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

  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text) => {
      if (!/[a-zA-Z0-9]/.test(text)) {
        return "";
      }
      return text;
    },
  });

  if (!sanitized || sanitized.trim().length === 0) {
    throw new Error("Question must contain alphanumeric characters");
  }

  return sanitized;
}

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    let sanitizedQuestion;
    try {
      sanitizedQuestion = sanitizeInput(question);
    } catch (sanitizeError) {
      return res.status(400).json({ error: sanitizeError.message });
    }

    const vectorStore = loadVectorStore();

    if (!vectorStore.documents || vectorStore.documents.length === 0) {
      return res.json({
        answer:
          "I'm sorry, but the knowledge base is not available at the moment. Please try again later.",
        sources: [],
      });
    }

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const queryEmbedding = await embeddings.embedQuery(sanitizedQuestion);

    const similarDocs = findSimilarDocuments(
      queryEmbedding,
      vectorStore.documents,
      4
    );

    const isStreaming = req.headers.accept?.includes("text/event-stream");

    if (isStreaming) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin":
          req.headers.origin || "https://andrewford.co.nz",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      });

      const llm = new ChatOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        model:
          process.env.OPENROUTER_MODEL ||
          "meta-llama/llama-3.2-3b-instruct:free",
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": process.env.SITE_URL || "https://andrewford.co.nz",
            "X-Title": "Andrew Ford Blog Chatbot",
          },
        },
        streaming: true,
      });

      const context = similarDocs
        .map((doc) => doc.pageContent)
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
        input: sanitizedQuestion,
      });

      const stream = await llm.stream(formattedPrompt);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`);
      }

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
      const sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];

      res.write(`data: ${JSON.stringify({ done: true, sources })}\n\n`);
      res.end();
    } else {
      const llm = new ChatOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        model:
          process.env.OPENROUTER_MODEL ||
          "meta-llama/llama-3.2-3b-instruct:free",
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": process.env.SITE_URL || "https://andrewford.co.nz",
            "X-Title": "Andrew Ford Blog Chatbot",
          },
        },
      });

      const context = similarDocs
        .map((doc) => doc.pageContent)
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
        input: sanitizedQuestion,
      });

      const response = await llm.invoke(formattedPrompt);

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
      const sources = uniqueLinks.length > 0 ? [uniqueLinks[0]] : [];

      res.json({
        answer: response.content,
        sources,
      });
    }
  } catch (error) {
    console.error("Error processing chatrag request:", error);

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: "Authentication error. Please check API configuration.",
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Model rate limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
});

export default router;
