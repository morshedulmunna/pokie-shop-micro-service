import { Status } from "@prisma/client";
import { z } from "zod";

export const ProductCreateDTOSchema = z.object({
  sku: z.string().min(3).max(10),
  name: z.string().min(3).max(255),
  description: z.string().max(1000),
  price: z.number().min(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});

export const InventoryUpdateDTOSchema = z.object({});

export type ProductCreateDTO = z.infer<typeof ProductCreateDTOSchema>;
