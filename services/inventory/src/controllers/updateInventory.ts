import { Request, Response, NextFunction } from "express";
import prisma from "@/prismaClient";
import { InventoryUpdateDTOSchema } from "@/schema";
import { ActionType } from "@prisma/client";

const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    //check if the inventory exists
    const inventory = await prisma.inventory.findUnique({
      where: { id: req.params.id },
    });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    //update the inventory
    const parseBody = InventoryUpdateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    //find the last history
    const lastHistory = await prisma.history.findFirst({
      where: { inventoryId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    let newQuantity = inventory.quantity;
    if (parseBody.data.actionType === "IN") {
      newQuantity += parseBody.data.quantity;
    } else if (parseBody.data.actionType === "OUT") {
      newQuantity -= parseBody.data.quantity;
    } else {
      return res.status(400).json({ message: "Invalid action type" });
    }

    const updateInventory = await prisma.inventory.update({
      where: { id: req.params.id },
      data: {
        quantity: newQuantity,
        histories: {
          create: {
            actionType: parseBody.data.actionType,
            quantityChange: parseBody.data.quantity,
            lastQuantity: lastHistory?.newQuantity || 0,
            newQuantity,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    res.status(200).json(updateInventory);
  } catch (error) {
    next(error);
  }
};

export default updateInventory;
