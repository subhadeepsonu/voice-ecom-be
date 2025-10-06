import { prisma } from "../db"

export async function AddToCart(userId: string, productId: string, quantity: number) {
    try {

        const cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                cartItem: true
            }
        })
        console.log(cart)
        if (!cart) {
            return "Cart not found"
        }
        const cartItem = await prisma.cartItems.create({
            data: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            }
        })
        return cartItem

    } catch (error) {
        return error
    }
}
export async function RemoveFromCart(userId: string, productId: string) {
    try {
        console.log(userId)
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
        const cartItem = await prisma.cartItems.delete({
            where: {
                id: productId
            }
        })
        return cartItem

    } catch (error) {
        return error
    }
}
export async function GetMyCart(userId: string) {
    try {
        console.log(userId)
        const cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                cartItem: {
                    include: {
                        product: true
                    }
                }
            }
        })
        console.log(cart)
        return cart
    } catch (error) {
        return error
    }
}
