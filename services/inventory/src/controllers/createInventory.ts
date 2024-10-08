import { Request, Response, NextFunction } from "express";
import prisma from "@/prismaClient";
import { InventoryCreateDTOSchema } from "@/schema";

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const parseBody = InventoryCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    const inventory = await prisma.inventory.create({
      data: {
        ...parseBody.data,
        histories: {
          create: {
            actionType: "IN",
            quantityChange: parseBody.data.quantity,
            lastQuantity: 0,
            newQuantity: parseBody.data.quantity,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    return res.status(201).json({
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

export default createInventory;
