import { z } from 'zod';

export const CartItemSchema = z.object({
    id: z.string(),
    productName: z.string(),
    productPrice: z.number(),
    productImage: z.string().optional().nullable(),
    quantity: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartComponentPropsSchema = z.object({
    id: z.string(),
    userId: z.string(),
    cart: z.array(CartItemSchema),
    messageType: z.enum(["Text", "Cart"]),
    message: z.string()
});

export type CartComponentProps = z.infer<typeof CartComponentPropsSchema>;