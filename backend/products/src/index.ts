import { Hono } from "hono";
import { Redis } from "ioredis";

const app = new Hono();

// Initialize Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
});


// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;