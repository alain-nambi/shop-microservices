import { Hono } from "hono";
import { Redis } from "ioredis";
import { db } from "./db/client";
import productRoute from "./routes/product_route";

/**
 * Products Service - Main Application Entry Point
 * This service handles product management operations including
 * creating products and retrieving product lists with caching
 */

const app = new Hono();

// --- Redis Client Configuration ---
export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  lazyConnect: true,
});

// Handle Redis connection events
redis.on("error", (err) => console.error("❌ Redis error:", err));
redis.on("connect", () => console.log("✅ Connected to Redis"));

// --- Health Check Endpoint ---
app.get("/health", (c) => c.json({ status: "ok" }));

// --- Product API Routes ---
app.route("/api/v1/products", productRoute);

// --- Server Startup ---
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4001;

console.log("🚀 Products service is starting...");
console.log(`🔧 Listening on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};