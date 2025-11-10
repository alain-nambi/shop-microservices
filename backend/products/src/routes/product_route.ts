import { Hono } from "hono";
import { getAllProducts, createProduct } from "../controllers/product_controller";

/**
 * Product Routes
 * Defines the API endpoints for product management
 * Base path: /api/v1/products
 */

const productRoute = new Hono();

// GET /api/v1/products - Retrieve all products
productRoute.get("/", getAllProducts);

// POST /api/v1/products - Create a new product
productRoute.post("/", createProduct);

export default productRoute;