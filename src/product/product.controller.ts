import z from "zod"
import { Response, Request } from "express"
import { prisma } from "../db"
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv"
dotenv.config()
const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    imgUrl: z.string().url(),
    price: z.number()
})
export async function AddProduct(req: Request, res: Response) {
    try {
        const body = req.body
        const check = productSchema.safeParse(body)
        if (!check.success) {
            res.status(402).json({
                message: check.error.message
            })
            return
        }
        const product = await prisma.products.create({
            data: {
                name: check.data.name,
                description: check.data.description,
                imgUrl: check.data.imgUrl,
                price: check.data.price
            }

        })
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small"
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "learning",
        });
        const docs = [
            new Document({
                pageContent: product.description,
                metadata: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imgUrl: product.imgUrl
                }
            })
        ]

        await vectorStore.addDocuments(docs)
        res.status(200).json({
            message: "product added succesfully",
            data: product
        })
        return

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error
        })
        return
    }
}