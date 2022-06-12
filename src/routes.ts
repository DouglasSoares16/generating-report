import { Router } from "express";
import { ProductController } from "./controllers/ProductController";

const productController = new ProductController();

const routes = Router();

routes.get("/products", productController.list);
routes.get("/products/report", productController.report);
routes.post("/products", productController.create);

export { routes };