import { z } from "zod";

export const InventoryCreateDTOSchema = z.object({});

export const InventoryUpdateDTOSchema = z.object({});

export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
