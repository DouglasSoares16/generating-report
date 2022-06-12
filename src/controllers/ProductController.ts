import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import PDFPrinter from "pdfmake";
import { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";

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

  async report(req: Request, res: Response) {
    const repository = getCustomRepository(ProductRepository);
    const products = await repository.find();

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const printer = new PDFPrinter(fonts);

    const body = [];

    const columnsTitle: TableCell[] = [
      { text: "ID", style: "columnID" },
      { text: "Nome", style: "columnsTitle" },
      { text: "Descrição", style: "columnsTitle" },
      { text: "Preço", style: "columnsTitle" },
      { text: "Quantidade", style: "columnsTitle" }
    ];

    const columnsBody = new Array();

    columnsTitle.forEach(column => columnsBody.push(column));

    body.push(columnsBody);

    for await (let product of products) {
      const rows = new Array();
      rows.push(product.id);
      rows.push(product.name);
      rows.push(product.description);
      rows.push(`R$ ${product.price}`);
      rows.push(product.quantity);

      body.push(rows);
    }

    const docDefinations: TDocumentDefinitions = {
      defaultStyle: { font: "Helvetica" },
      content: [
        {
          columns: [
            { text: "Relatório de Produtos", style: "header" },
            { text: "12/06/2022\n\n", style: "header" }
          ]
        },
        {
          table: {
            heights: () => {
              return 30;
            },
            widths: [230, "auto", "auto", 50, "auto"],
            body
          }
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: "center"
        },
        columnsTitle: {
          fontSize: 15,
          bold: true,
          fillColor: "#7150c1",
          color: "#fff",
          alignment: "center",
          margin: 2
        },
        columnID: {
          fontSize: 15,
          bold: true,
          fillColor: "#999",
          color: "#fff",
          alignment: "center",
          margin: 4,
        }
      }
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinations);

    const chunks = [];

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    })

    pdfDoc.end();

    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.end(result);
    })
  }
}

export { ProductController };