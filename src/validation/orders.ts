import { z } from "zod/v4";
import { mongoDbIdSchema } from "./utils.js";

export const createOrderSchema = z.object({
 fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  wilaya: z.string().min(2, "Wilaya/state is required"),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
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