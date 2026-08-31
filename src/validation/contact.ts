import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Email must be valid").trim().toLowerCase(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export const replySchema = z.object({
  reply: z.string().min(5, "Reply must be at least 5 characters"),
});
export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;