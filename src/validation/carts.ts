import { z } from "zod/v4";
import { mongoDbIdSchema } from "./utils.js";

export const addToCartSchema = z.object({
  productId: mongoDbIdSchema,
  variantId: mongoDbIdSchema,
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;