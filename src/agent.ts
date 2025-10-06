import { Agent, tool } from '@openai/agents';
import dotenv from "dotenv"
import { getAllProducts, getProduct, getProductById } from './tools/product';
import z from 'zod';
import { AddToCart, RemoveFromCart, GetMyCart } from './tools/cart';
import { CreateOrder, getOrderById, getOrders } from './tools/order';
import { CartComponentPropsSchema } from './types/cart';
import { productMessageSchema } from './types/product';
dotenv.config()

const searchProductTool = tool({
    name: "search product",
    description: "use this tool form vector search in products",
    parameters: z.object({
        name: z.string(),
    }),
    async execute({ name }) {
        return await getProduct(name)
    }
})

const getProductTool = tool({
    name: "getProduct",
    description: "use this tool form vector search in products",
    parameters: z.object({}),
    async execute() {
        return await getAllProducts()
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


const productAgent = new Agent({
    name: "find product agent",
    instructions: "you are a agent who can find products by using tools you can find products based on brand and categories",
    model: "gpt-4o-mini",
    outputType: productMessageSchema,
    tools: [getProductTool, getProductByIdTool, searchProductTool]
})

const productAgentTool = productAgent.asTool({
    toolName: "product agent tool",
    toolDescription: "get products required to add to cart if cant find any dont add them"
})

const orderAgent = new Agent({
    name: "order agent",
    instructions: "you are a agent who can order items and track the orders status if your are asked to add anything to cart  search for the product id using product agent tool ",
    model: "gpt-4o-mini",
    outputType: CartComponentPropsSchema,
    tools: [getOrderByIdTool, getOrdersTool, createOrderTool, productAgentTool],
})

const cartAgent = new Agent({
    name: "cart agent",
    instructions: "you are a cart agent who has access to cart tools who can add/remove items from cart and show current cart",
    model: "gpt-4o-mini",
    outputType: CartComponentPropsSchema,
    tools: [addToCartTool, removeFromCartTool, getMyCartTool, productAgentTool]
})
export const ecomAgent = Agent.create({
    name: 'Assistant',
    instructions: 'You are a helpful assistant',
    model: "gpt-4o-mini",
    handoffs: [productAgent, orderAgent, cartAgent]
});




