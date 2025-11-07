import { Hono } from "hono";
import { getAllProducts } from "../controllers/product_controller";

const productRoute = new Hono()

productRoute.get("/", getAllProducts);

export default productRoute;