import dotenv from "dotenv";
dotenv.config();

import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis-based rate limiting
const redis = Redis.fromEnv(); // Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"), // 10 requests per 15 minutes
  analytics: true, // Enable analytics
});

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

  // Remove potentially dangerous characters/patterns
  const sanitized = trimmed
    .replace(/[<>\"']/g, "") // Remove HTML/script injection chars
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/\s+/g, " "); // Normalize whitespace

  // Basic content validation - ensure it's not just special characters
  if (!/[a-zA-Z0-9]/.test(sanitized)) {
    throw new Error("Question must contain alphanumeric characters");
  }

  return sanitized;
}

async function checkRateLimit(clientIP) {
  try {
    const { success, limit, remaining, reset, pending } = await ratelimit.limit(
      clientIP
    );

    if (!success) {
      const resetTime = new Date(reset);
      const waitTime = Math.ceil((reset - Date.now()) / 1000 / 60); // minutes

      throw new Error(`Rate limit exceeded. Try again in ${waitTime} minutes.`);
    }

    return { remaining, reset };
  } catch (error) {
    // If rate limiting service is down, allow the request but log the error
    console.error("Rate limiting service error:", error);
    return { remaining: 999, reset: Date.now() + 900000 }; // Default fallback
  }
}

export const handler = async (event, context) => {
  try {
    // Extract client IP for rate limiting
    const clientIP =
      event.headers["x-forwarded-for"] ||
      event.headers["x-real-ip"] ||
      event.connection?.remoteAddress ||
      "unknown";

    // Check rate limit first
    await checkRateLimit(clientIP);

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
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4.1-nano",
    });

    const vectorStore = await FaissStore.load("./vector_store", embeddings);
    const retriever = vectorStore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(`
      Answer the following question based only on the provided context:
      
      <context>
      {context}
      </context>
      
      Question: {input}
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

    const allowedOrigins = [
      "http://localhost:8888",
      "https://andrewford.co.nz",
    ];
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
        sourceDocuments: response.context,
      }),
    };
  } catch (error) {
    // Handle rate limit errors specifically
    if (error.message.includes("Rate limit exceeded")) {
      return {
        statusCode: 429,
        headers: {
          "Access-Control-Allow-Origin":
            event.headers.origin || "https://andrewford.co.nz",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
          "Retry-After": "900", // 15 minutes in seconds
        },
        body: JSON.stringify({ error: error.message }),
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
      body: JSON.stringify({ error: error.message }),
    };
  }
};
