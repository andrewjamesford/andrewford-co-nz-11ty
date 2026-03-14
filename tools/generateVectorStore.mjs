import dotenv from "dotenv";
dotenv.config();

import { OpenAIEmbeddings } from "@langchain/openai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

export async function generateVectorStore() {
  // Check if running in development environment
  if (process.env.NODE_ENV === "production") {
    console.log(
      "Vector store generation is disabled in production environment."
    );
    return;
  }

  const loader = new DirectoryLoader(
    "./content",
    {
      ".md": (path) => new TextLoader(path),
    },
    true
  );
  const docs = await loader.load();

  console.log(`Loaded ${docs.length} documents.`);
  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
  await vectorStore.save("./vector_store");
  console.log("Vector store saved.");
}

// Check if the file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVectorStore().catch(console.error);
}
