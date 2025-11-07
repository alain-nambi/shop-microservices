import { Hono } from "hono";
import { getAllProducts, createProduct } from "../controllers/product_controller";

const productRoute = new Hono()

productRoute.get("/", getAllProducts);
productRoute.post("/", createProduct);

export default productRoute;