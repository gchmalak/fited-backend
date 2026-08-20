import z from "zod";

export const createSlideSchema = z.object({
    imageUrl: z.url("image must be a valid url"),
    ctaText:z.string(),
    ctaLink:z.string().optional(),
    order:z.number().optional(),
    isActive:z.boolean().optional(),
})


export const updateSlideSchema = createSlideSchema.partial()