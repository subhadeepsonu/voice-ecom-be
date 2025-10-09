import z from "zod"

export const OrderStatusSchema = z.enum(['placed', 'shipped', 'delivered', 'cancelled']);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    productName: z.string(),
    productPrice: z.number(),
    productImage: z.string().optional().nullable(),
    quantity: z.number(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderComponentPropsSchema = z.object({
    id: z.string(),
    status: OrderStatusSchema,
    orders: z.array(OrderItemSchema),
    messageType: z.enum(["Text", "Order"]),
    message: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type OrderComponentProps = z.infer<typeof OrderComponentPropsSchema>;
