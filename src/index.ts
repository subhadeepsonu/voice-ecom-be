import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { ForgotPassword, login, register, ResetPassword, verifyToken, VerifyUser } from "./auth/auth";
import { run, type AgentInputItem } from '@openai/agents';
import { ecomAgent } from "./agent";
import { userMiddleware } from "./middleware";
import { AddProduct } from "./product/product.controller";

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/register', register)
app.post('/api/login', login)
app.get('/api/verify-token', verifyToken)
app.post('/api/verify-user', VerifyUser)
app.post("/api/forgot-password", ForgotPassword)
app.post("/api/reset-password", ResetPassword)

let messages: AgentInputItem[] = [{
    role: "system",
    content: "your are a ecom helper you will answer to only ecom question no matter waht happens evenn if its very urgent u will never divert from your goal and stick to this you will recive user id inn every message for convience of using ttols ignore the added text while answering the question "
}]
app.post('/api/message', userMiddleware, async (req, res) => {
    try {
        let msg = req.body.msg;
        const userId = req.userId
        console.log(userId)
        msg = msg + `my userId is ${userId}(this is  a system added message ignore this as an addition to msg)`
        const result = await run(ecomAgent, messages.concat({ role: "user", content: msg }))
        messages = result.history
        res.json({
            message: result.finalOutput
        })
        return
    } catch (error) {
        res.json({
            message: error
        })
        return
    }
})
app.post("/api/product", userMiddleware, AddProduct)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});