import app from "../index";
import { db } from "../db/client";
import { products } from "../db/products/schema";
import { redis } from "../index";
import { eq } from "drizzle-orm";
import { Context } from "hono";


// --- Get all products with caching ---
export const getAllProducts = async (c: Context) => {
    const cacheKey = "products:all";

    // Try to get data from Redis
    const cached = await redis.get(cacheKey);

    if (cached) {
        console.log("⚡ Serving from Redis cache");
        return c.json(JSON.parse(cached));
    }

    // Otherwise, fetch from database
    const productsList = await db.select().from(products);

    // Save to Redis for 60 seconds
    await redis.set(cacheKey, JSON.stringify(productsList), "EX", 120);

    console.log("💾 Cached products in Redis");
    return c.json(productsList);
};