import prisma from "@/prismaClient";
import { Request, Response, NextFunction } from "express";

const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const products = await prisma.product.findMany();

    // TODO: add pagination
    //TODO: add Filtering

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export default getProducts;
