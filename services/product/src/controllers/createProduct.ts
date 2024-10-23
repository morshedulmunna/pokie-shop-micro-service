import { INVENTORY_URL } from "@/config";
import prisma from "@/prismaClient";
import { ProductCreateDTOSchema } from "@/schema";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  // Create a new product with transaction and handle failures
  try {
    const parseBody = ProductCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseBody.error.errors,
      });
    }

    const existProduct = await prisma.product.findFirst({
      where: {
        sku: parseBody.data.sku,
      },
    });

    if (existProduct) {
      return res.status(409).json({
        message: "Product with the same SKU already exists",
      });
    }

    // Use a transaction to ensure atomicity between product creation and inventory association
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new product
      const product = await prisma.product.create({
        data: parseBody.data,
      });

      try {
        // Call the external inventory service
        const { data: inventory } = await axios.post(
          `${INVENTORY_URL}/inventory`,
          {
            productId: product.id,
            sku: product.sku,
          }
        );

        // Update the product with the inventory ID
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            inventoryId: inventory.id,
          },
        });

        return {
          product,
          inventoryId: inventory.id,
        };
      } catch (inventoryError) {
        console.log(inventoryError);
        // If the inventory request fails, throw an error to trigger transaction rollback
        throw new Error("Failed to create inventory entry");
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Failed to create inventory entry"
    ) {
      return res.status(500).json({
        message: "Product creation failed due to inventory service error.",
      });
    }
    next(error);
  }
};

export default createProduct;
