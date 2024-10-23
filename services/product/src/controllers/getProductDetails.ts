import { INVENTORY_URL } from "@/config";
import prisma from "@/prismaClient";
import axios from "axios";
import { Response, Request, NextFunction } from "express";

const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.inventoryId === null) {
      const {
        data: { inventory },
      } = await axios.post(`${INVENTORY_URL}/inventory`, {
        productId: product.id,
        sku: product.sku,
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          inventoryId: inventory.id,
        },
      });

      return res.status(200).json({
        ...product,
        inventoryId: inventory.id,
        stock: inventory.quantity,
        stockStatus: inventory.quantity > 0 ? " In Stock" : "Out of Stock",
      });
    }

    const { data: inventory } = await axios.get(
      `${INVENTORY_URL}/inventory/${product.inventoryId}`
    );

    return res.status(200).json({
      ...product,
      inventoryId: inventory.id,
      stock: inventory.quantity,
      stockStatus: inventory.quantity > 0 ? " In Stock" : "Out of Stock",
    });
  } catch (error) {
    next(error);
  }
};

export default getProductDetails;
