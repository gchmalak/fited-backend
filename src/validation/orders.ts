import { z } from "zod/v4";
import { mongoDbIdSchema } from "./utils.js";

export const createOrderSchema = z.object({
  address: z.string().min(5, "Address is required"),
  items:z.array(
    z.object({
      productId:mongoDbIdSchema,
      variantId:mongoDbIdSchema,
      quantity:z.number().int().min(1)
    })
  ).min(1,"cart cannot be empty")
});
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;