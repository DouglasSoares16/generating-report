import { Router } from "express";
import { ProductController } from "./controllers/ProductController";

const productController = new ProductController();

const routes = Router();

routes.get("/products", productController.list);
routes.post("/products", productController.create);

export { routes };