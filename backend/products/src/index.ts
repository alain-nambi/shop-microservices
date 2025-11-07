import { Hono } from "hono";
import { Redis } from "ioredis";
import { db } from "./db/client";
import { products } from "./db/products/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

// --- Redis Client ---
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  lazyConnect: true,
});

// Gracefully handle Redis connection errors
redis.on("error", (err) => console.error("❌ Redis error:", err));
redis.on("connect", () => console.log("✅ Connected to Redis"));

// --- Health Check ---
app.get("/health", (c) => c.json({ status: "ok" }));

// --- Get all products with caching ---
app.get("/products", async (c) => {
  const cacheKey = "products:all";

  // Try to get data from Redis
  const cached = await redis.get(cacheKey);

  console.log("🔍 Checking Redis cache for products");

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
});

// --- Create a new product ---
app.post("/products", async (c) => {
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
});

// --- Get single product (with per-item cache) ---
app.get("/products/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const cacheKey = `product:${id}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`⚡ Product ${id} served from cache`);
    return c.json(JSON.parse(cached));
  }

  const [product] = await db.select().from(products).where(eq(products.id, id));

  if (!product) return c.json({ error: "Product not found" }, 404);

  // Cache individual product for 5 minutes
  await redis.set(cacheKey, JSON.stringify(product), "EX", 300);

  console.log(`💾 Cached product ${id} in Redis`);
  return c.json(product);
});

export default app;
