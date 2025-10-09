import z from "zod"

export const ProductCardPropsSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string().optional().nullable(),
});

export const productMessageSchema = z.object({
    id: z.string(),
    message: z.string(),
    messageType: z.enum(["Text", "Product"]),
    products: z.array(ProductCardPropsSchema)
})

