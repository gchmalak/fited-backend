import { z } from "zod/v4";

export const updateEditorialSchema = z.object({
  image1Url: z.url("Image 1 must be a valid URL"),
  image2Url: z.url("Image 2 must be a valid URL").optional(),
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  discoverHref: z.string().optional(),
});


export type UpdateEditorialInput = z.infer<typeof updateEditorialSchema>;