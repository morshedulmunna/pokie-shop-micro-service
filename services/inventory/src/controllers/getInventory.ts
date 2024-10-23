import prisma from "@/prismaClient";
import { Request, Response, NextFunction } from "express";

async function getInventory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  //get all Inventory
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        histories: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(inventories);
  } catch (error) {
    next(error);
  }
}
export default getInventory;
