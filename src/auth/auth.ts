import { Response, Request } from "express"
import { prisma } from "../db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator"
import { sendVerificationEmail } from "../utils/mail"

export async function register(req: Request, res: Response) {
    try {
        const { success, data } = registerSchema.safeParse(req.body)
        if (!success) {
            return res.status(400).json({ error: "Invalid request" })
        }
        const checkUser = await prisma.user.findUnique({
            where: { email: data.email, isVerified: true }
        })
        if (checkUser) {
            return res.status(400).json({ error: "User already exists" })
        }
        const { name, email, password } = data
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name,
                isVerified: false
            },
            create: {
                email,
                password: hashedPassword,
                name
            }
        })
        await prisma.cart.upsert({
            where: { userId: user.id },
            update: {
                userId: user.id
            },
            create: {
                userId: user.id
            }
        })
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
        await sendVerificationEmail(user.email, token, "Verify your email", "verification")
        return res.status(200).json({ message: "User registered successfully" })

    } catch (error) {
        console.error("Error registering user:", error)
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

export async function VerifyUser(req: Request, res: Response) {
    try {
        const { token } = req.body
        if (!token) {
            res.status(400).json({ error: "Invalid token" })
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })
        if (!user) {
            res.status(400).json({ error: "User not found" })
            return
        }
        if (user.isVerified) {
            res.status(400).json({ error: "User already verified" })
            return
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
        })
        res.status(200).json({ message: "User verified successfully" })
        return
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" })
        return
    }
}


export async function verifyToken(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" })
            }
            return res.status(200).json({ message: "Token is valid" })
        })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }
}

export async function ForgotPassword(req: Request, res: Response) {
    try {
        const body = req.body
        const { success, data } = forgotPasswordSchema.safeParse(body)
        if (!success) {
            return res.status(400).json({ error: "Invalid request" })
        }
        const { email } = data
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
        await sendVerificationEmail(user.email, token, "Reset your password", "reset")
        return res.status(200).json({ message: "Password reset email sent" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }
}
export async function ResetPassword(req: Request, res: Response) {
    try {
        const body = req.body
        const { success, data } = resetPasswordSchema.safeParse(body)
        if (!success) {
            return res.status(400).json({ error: "Invalid request" })
        }
        const { token, password } = data
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })
        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })
        return res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }
}
