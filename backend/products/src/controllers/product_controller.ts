import { Context } from "hono";
import { db } from "../db/client";
import { products } from "../db/products/schema";
import { redis } from "../index";
import { eq } from "drizzle-orm";

/**
 * Product Controller
 * Contains business logic for handling product-related operations
 */

/**
 * Retrieves all products with Redis caching
 * @param c - Hono context
 * @returns JSON response with array of products
 */
export const getAllProducts = async (c: Context) => {
    const cacheKey = "products:all";

    try {
        // Try to get data from Redis cache
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ Serving from Redis cache");
            return c.json(JSON.parse(cached));
        }

        // Fetch from database if not in cache
        const productsList = await db.select().from(products);

        // Cache results for 2 minutes
        await redis.set(cacheKey, JSON.stringify(productsList), "EX", 120);

        console.log("💾 Cached products in Redis");
        return c.json(productsList);
    } catch (error) {
        console.error("Error fetching products:", error);
        return c.json({ error: "Failed to fetch products" }, 500);
    }
};

/**
 * Creates a new product
 * @param c - Hono context
 * @returns JSON response with created product
 */
export const createProduct = async (c: Context) => {
    try {
        const { name, price, category, description } = await c.req.json();

        // Validate required fields
        if (!name || !price || !description) {
            return c.json({ error: "Name, price, and description are required" }, 400);
        }

        // Insert into database
        const [newProduct] = await db
            .insert(products)
            .values({ name, price, description, category })
            .returning();

        // Invalidate cache so next read refreshes data
        await redis.del("products:all");

        console.log("🆕 Product created and cache invalidated");

        return c.json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        return c.json({ error: "Failed to create product" }, 500);
    }
};