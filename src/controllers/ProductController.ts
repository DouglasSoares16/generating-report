import { Request, Response } from "express";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

class ProductController {
  async create(req: Request, res: Response) {
    const repository = getCustomRepository(ProductRepository);
    const { name, price, description, quantity } = req.body;

    const product = repository.create({ name, price, description, quantity });

    await repository.save(product);

    return res.status(201).json({
      message: "Created Product"
    });
  }

  async list(req: Request, res: Response) {
    const repository = getCustomRepository(ProductRepository);
    const products = await repository.find();

    return res.json(products);
  }
}

export { ProductController };