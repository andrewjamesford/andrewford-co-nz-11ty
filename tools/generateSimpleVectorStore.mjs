import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSimpleVectorStore() {
  console.log("Loading documents from content directory...");

  // Load all markdown files
  const loader = new DirectoryLoader(
    "./content",
    {
      ".md": (path) => new TextLoader(path),
    },
    true
  );
  const docs = await loader.load();

  console.log(`Loaded ${docs.length} documents.`);

  // Split documents into chunks
  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  console.log(`Split into ${splitDocs.length} chunks.`);

  // Initialize embeddings
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Generate embeddings for all documents
  console.log("Generating embeddings for all documents...");
  const processedDocs = [];

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < splitDocs.length; i += batchSize) {
    const batch = splitDocs.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        splitDocs.length / batchSize
      )}...`
    );

    try {
      // Generate embeddings for the batch
      const texts = batch.map((doc) => doc.pageContent);
      const batchEmbeddings = await embeddings.embedDocuments(texts);

      // Add to processed documents
      batch.forEach((doc, index) => {
        processedDocs.push({
          id: `doc_${i + index}`,
          pageContent: doc.pageContent,
          metadata: doc.metadata,
          embedding: batchEmbeddings[index],
        });
      });

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing batch starting at ${i}:`, error.message);
    }
  }

  // Save the vector store
  const outputPath = path.join(
    __dirname,
    "../vector_store/simple_vector_store.json"
  );
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        documents: processedDocs,
        embeddings_model: "text-embedding-ada-002",
        created_at: new Date().toISOString(),
        total_documents: processedDocs.length,
      },
      null,
      2
    )
  );

  console.log(
    `Saved ${processedDocs.length} documents with embeddings to ${outputPath}`
  );
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSimpleVectorStore().catch(console.error);
}
