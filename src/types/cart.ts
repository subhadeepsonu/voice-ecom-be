import { z } from 'zod';

export const CartItemSchema = z.object({
    id: z.string(),
    productName: z.string(),
    productPrice: z.string(),
    productImage: z.string().optional().nullable(),
    quantity: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartComponentPropsSchema = z.object({
    id: z.string(),
    userId: z.string(),
    items: z.array(CartItemSchema),
    message: z.string()
});

export type CartComponentProps = z.infer<typeof CartComponentPropsSchema>;