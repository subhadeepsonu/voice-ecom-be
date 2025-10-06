import z from "zod"

export const ProductCardPropsSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    imageUrl: z.string().optional().nullable(),
});

export const productMessageSchema = z.object({
    id: z.string(),
    message: z.string(),
    products: z.array(ProductCardPropsSchema)
})

