import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
export async function userMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" })
    }
}