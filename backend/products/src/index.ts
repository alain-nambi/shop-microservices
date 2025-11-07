import { Hono } from "hono";
import { Redis } from "ioredis";
import { db } from "./db/client";
import { products } from "./db/products/schema";

const app = new Hono();

// Initialize Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
});


// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));


// Get all products
app.get("/products", async (c) => {
    // Here you would normally fetch products from your database
    // For demonstration, we will return a static list
    const productsList = await db.select().from(products);
    console.log(productsList);
    return c.json(productsList);
});


// Create a new product
app.post("/products", async (c) => {
    const { id, name, price, category, description } = await c.req.json();


    if (!name || !price) {
        return c.json({ error: "Name and price are required" }, 400);
    }

    if (!description) {
        return c.json({ error: "Description is required" }, 400);
    }

    await db.insert(products).values({ id, name, price, description, category }).returning();

    return c.json({ message: "Product created", product: { id, name, price, description, category } });
});

export default app;