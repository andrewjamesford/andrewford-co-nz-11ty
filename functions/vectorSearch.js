// Cosine similarity calculation
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find most similar documents
function findSimilarDocuments(queryEmbedding, documents, topK = 4) {
  const similarities = documents.map((doc) => ({
    document: doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Sort by similarity (highest first)
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return top K documents
  return similarities.slice(0, topK).map((item) => ({
    pageContent: item.document.pageContent,
    metadata: item.document.metadata,
    similarity: item.similarity,
  }));
}

module.exports = {
  cosineSimilarity,
  findSimilarDocuments,
};
