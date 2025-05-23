import dotenv from "dotenv";
dotenv.config();

import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

exports.handler = async (event, context) => {
  try {
    const { question } = JSON.parse(event.body);

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
      input: question,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: response.answer,
        sourceDocuments: response.context,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
