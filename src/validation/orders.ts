import { z } from "zod/v4";

export const createOrderSchema = z.object({
  address: z.string().min(5, "Address is required"),
});
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;