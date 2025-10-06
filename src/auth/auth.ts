import z from "zod"
import { Response, Request } from "express"
import { prisma } from "../db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export async function register(req: Request, res: Response) {
    try {
        const { success, data } = registerSchema.safeParse(req.body)
        if (!success) {
            return res.status(400).json({ error: "Invalid request" })
        }
        const checkUser = await prisma.user.findUnique({
            where: { email: data.email }
        })
        if (checkUser) {
            return res.status(400).json({ error: "User already exists" })
        }
        const { email, password } = data
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
        await prisma.cart.create({
            data: {
                userId: user.id
            }
        })
        return res.status(200).json({ message: "User registered successfully" })

    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }

}
export async function login(req: Request, res: Response) {
    try {
        const { success, data } = loginSchema.safeParse(req.body)
        if (!success) {
            return res.status(400).json({ error: "Invalid request" })
        }
        const { email, password } = data
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" })
        }
        console.log(user.id)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
        return res.status(200).json({ token })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }
}