import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { Readable } from "stream";
import dotenv from "dotenv"
import { login, register } from "./auth/auth";
dotenv.config()
const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
import { run, type AgentInputItem } from '@openai/agents';
import { ecomAgent } from "./agent";
import { userMiddleware } from "./middleware";
app.use(cors());
app.use(express.json());
app.post('/api/register', register)
app.post('/api/login', login)
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
        console.log("hihhi")
        console.log(result)
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

function webToNodeStream(webStream: ReadableStream<Uint8Array>): Readable {
    const reader = webStream.getReader();
    return new Readable({
        async read() {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    this.push(null);
                } else {
                    this.push(Buffer.from(value));
                }
            } catch (err) {
                this.destroy(err as Error);
            }
        }
    });
}

app.post('/api/tts', async (req, res) => {
    try {
        const { text, voice = 'alloy', model = 'tts-1' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        console.log('Generating speech for:', text.substring(0, 50) + '...');

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');

        const response = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            response_format: 'mp3'
        });

        const nodeStream = webToNodeStream(response.body);

        nodeStream.on('error', (err) => {
            console.error('Stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Stream error' });
            }
        });

        nodeStream.pipe(res);

    } catch (err: any) {
        console.error('TTS error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});

app.get('/api/voices', (req, res) => {
    res.json({
        voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});