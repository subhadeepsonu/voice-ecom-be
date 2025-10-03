import { prisma } from "../db"

export async function CreateOrder(userId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                cartItem: true
            }
        })
        if (!cart) {
            return "Cart not found"
        }
        const resp = await prisma.orders.create({
            data: {
                orderItems: {
                    create: cart.cartItem.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            }
        })
        return resp
    } catch (error) {
        console.log(error)
        return error
    }
}
export async function getOrders() {
    try {
        const resp = await prisma.orders.findMany({
            include: {
                orderItems: true
            }
        })
        return resp
    } catch (error) {
        return "no orders"
    }
}
export async function getOrderById(id: string) {
    try {
        const data = await prisma.orders.findUnique({
            where: {
                id
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return data

    } catch (error) {
        "no orders"
    }
}
