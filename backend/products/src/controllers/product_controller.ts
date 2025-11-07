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

export const createProduct = async (c: Context) => {
    const { id, name, price, category, description } = await c.req.json();

    // Basic validation
    if (!name || !price || !description) {
        return c.json({ error: "Name, price, and description are required" }, 400);
    }

    // Insert into DB
    const [newProduct] = await db
        .insert(products)
        .values({ id, name, price, description, category })
        .returning();

    // Invalidate cache so next read refreshes data
    await redis.del("products:all");

    console.log("🆕 Product created and cache invalidated");

    return c.json({ message: "Product created", product: newProduct });
}