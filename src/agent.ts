import { Agent, run, tool } from '@openai/agents';
import dotenv from "dotenv"
import { getCatgory, getBrands, getProduct, getCategoryId, getBrandId, getProductById } from './tools/product';
import z from 'zod';
import { AddToCart, RemoveFromCart, GetMyCart } from './tools/cart';
import { CreateOrder, getOrderById, getOrders } from './tools/order';
dotenv.config()
const getCategoriesTool = tool({
    name: "getCategories",
    description: "Get all categories",
    parameters: z.object({}),
    async execute() {
        return await getCatgory()
    }
})
const getBrandsTool = tool({
    name: "getBrands",
    description: "Get all brands",
    parameters: z.object({}),
    async execute() {
        return await getBrands()
    }
})
const getProductTool = tool({
    name: "getProduct",
    description: "Get all products",
    parameters: z.object({
        name: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
        brandId: z.string().optional().nullable(),
    }),
    async execute({ name, categoryId, brandId }) {
        return await getProduct(name, categoryId, brandId)
    }
})
const getProductByIdTool = tool({
    name: "getProductById",
    description: "Get a product by id",
    parameters: z.object({
        id: z.string(),
    }),
    async execute({ id }) {
        return await getProductById(id)
    }
})
const getCategoryIdTool = tool({
    name: "getCategoryId",
    description: "Get a category by id",
    parameters: z.object({
        id: z.string(),
    }),
    async execute({ id }) {
        return await getCategoryId(id)
    }
})
const getBrandIdTool = tool({
    name: "getBrandId",
    description: "Get a brand by id",
    parameters: z.object({
        id: z.string(),
    }),
    async execute({ id }) {
        return await getBrandId(id)
    }
})
const addToCartTool = tool({
    name: "addToCart",
    description: "Add a product to cart",
    parameters: z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
    }),
    async execute({ userId, productId, quantity }) {
        return await AddToCart(userId, productId, quantity)
    }

})
const removeFromCartTool = tool({
    name: "removeFromCart",
    description: "Remove a product from cart",
    parameters: z.object({
        userId: z.string(),
        productId: z.string(),
    }),
    async execute({ userId, productId }) {
        return await RemoveFromCart(userId, productId)
    }
})
const getMyCartTool = tool({
    name: "getMyCart",
    description: "Get my cart",
    parameters: z.object({
        userId: z.string(),
    }),
    async execute({ userId }) {
        return await GetMyCart(userId)
    }
})
const createOrderTool = tool({
    name: "createOrder",
    description: "Create an order",
    parameters: z.object({
        userId: z.string(),
    }),
    async execute({ userId }) {
        return await CreateOrder(userId)
    }
})
const getOrdersTool = tool({
    name: "getOrders",
    description: "Get all orders",
    parameters: z.object({}),
    async execute() {
        return await getOrders()
    }
})
const getOrderByIdTool = tool({
    name: "getOrderById",
    description: "Get an order by id",
    parameters: z.object({
        id: z.string(),
    }),
    async execute({ id }) {
        return await getOrderById(id)
    }
})
const tools = [getCategoriesTool, getBrandsTool, getProductTool, getProductByIdTool, getCategoryIdTool, getBrandIdTool, addToCartTool, removeFromCartTool, getMyCartTool, createOrderTool, getOrdersTool, getOrderByIdTool]
export const ecomAgent = new Agent({
    name: 'Assistant',
    instructions: 'You are a helpful assistant',
    model: "gpt-4o",
    tools: tools
});




