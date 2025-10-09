import { prisma } from "../db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function getProduct(name: string) {
    try {
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small"
        });
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "learning",
        });
        const resp = await vectorStore.similaritySearchWithScore(name)
        const filtered = resp
            .filter(([_, score]) => score > 0.3)
            .map(([document]) => document.metadata);
        return filtered
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Something went wrong while fetching products");
    }
}

export async function getAllProducts() {
    try {
        const resp = await prisma.products.findMany()
        return resp
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Something went wrong while fetching products");
    }
}

export async function getProductById(id: string) {
    try {
        const resp = await prisma.products.findUnique({
            where: {
                id
            }
        })
        return resp
    } catch (error) {
        return "no product found"
    }
}
