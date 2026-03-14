import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAIEmbeddings } from "@langchain/openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function preprocessDocuments() {
  console.log("Loading documents from vector store...");

  // Read the existing docstore
  const docstorePath = path.join(__dirname, "../vector_store/docstore.json");
  const docstoreContent = fs.readFileSync(docstorePath, "utf-8");
  const rawDocstore = JSON.parse(docstoreContent);

  // Flatten the nested array structure
  const docstore = rawDocstore.flat();

  console.log(`Found ${docstore.length} documents`);

  // Initialize embeddings
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Process documents with embeddings
  const processedDocs = [];

  for (let i = 0; i < docstore.length; i++) {
    const [id, doc] = docstore[i];

    if (i % 10 === 0) {
      console.log(`Processing document ${i + 1}/${docstore.length}...`);
    }

    try {
      // Generate embedding for this document
      const embedding = await embeddings.embedQuery(doc.pageContent);

      processedDocs.push({
        id,
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        embedding: embedding,
      });
    } catch (error) {
      console.error(`Error processing document ${id}:`, error.message);
    }
  }

  // Save processed documents
  const outputPath = path.join(
    __dirname,
    "../vector_store/processed_documents.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(processedDocs, null, 2));

  console.log(
    `Saved ${processedDocs.length} processed documents to ${outputPath}`
  );
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  preprocessDocuments().catch(console.error);
}
