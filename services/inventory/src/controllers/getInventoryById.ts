import prisma from "@/prismaClient";
import { Request, Response, NextFunction } from "express";
const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: req.params.id },
      include: {
        histories: true,
      },
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
};

export default getInventoryById;
