import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv"
dotenv.config()
async function upload() {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small"
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "learning",
    });

    const docs = [
        new Document({
            pageContent: "This is a product description for a new AI-powered laptop.", // <-- must not be empty
            metadata: {
                id: "1",
                name: "AI Laptop",
                description: "This is a product description for a new AI-powered laptop.",
            },
        }),
        new Document({
            pageContent: "Smartphone with high-resolution display and great battery life.",
            metadata: {
                id: "2",
                name: "SuperPhone X",
                description: "Smartphone with high-resolution display and great battery life.",
            },
        }),
    ];
    await vectorStore.addDocuments(docs)
    console.log("product added ")

}
async function similaritySearch() {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small"
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "learning",
    });
    const resp = await vectorStore.similaritySearchWithScore("laptop")
    const filterred = resp.filter(([document, score]) => {
        return score > 0.3
    })
    console.log(filterred)
}
similaritySearch()
