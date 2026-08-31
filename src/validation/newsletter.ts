import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.email("Email must be valid").trim().toLowerCase(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export const broadcastSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});