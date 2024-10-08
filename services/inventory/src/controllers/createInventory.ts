import { Request, Response, NextFunction } from "express";
import prisma from "@/prismaClient";
import { InventoryCreateDTOSchema } from "@/schema";

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = InventoryCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    const inventory = await prisma.inventory.create({
      data: {
        ...parseBody.data,
      },
    });
  } catch (error) {
    next(error);
  }
};
