import  { z } from "zod/v4";
import { DEPARTMENTS } from "../types/models/product.js";


export const subcategorySchema = z.object({
    name:z.string().min(2,"Subcategory  name is required"),
})
export const createCategorySchema= z.object({
    name:z.string().min(2,"Category name is required"),
    department:z.enum(DEPARTMENTS),
    subcategories:z.array(subcategorySchema).default([])
})

// so when user updates a field thay are not all required
export const updateCategorySchema= createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>