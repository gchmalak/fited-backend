import z from "zod";
import { CATEGORIES, DEPARTMENTS } from "../types/models/product.js";

export const variantSchema = z.object({

    stock:z.coerce.number().int().min(0),
    sku:z.string().min(1,"SKU is required"),
    size:z.string().optional(),
    color:z.string().optional(),
    shade:z.string().optional()
})


export const    createProductSchema = z.object({
name:z.string().min(3,"Name should at least be 3 characters long").max(20,"Name should at most be 20 characters long"),
description:z.string().min(10,"Description should at least be 10 characters long"),
department:z.enum(DEPARTMENTS),
category:z.enum(CATEGORIES).optional(), //optional as not  every product has a category
price:z.coerce.number().min(1000, "Price should at least be 1000 DA"),
images:z.array(z.url("Each image must be a valid URL")).min(1,"Product should at least have 1 image"),
variants:z.array(variantSchema).default([]),
brand:z.string().min(1,"Brand is required"),


})

export const updateProductSchema = createProductSchema.partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput= z.infer<typeof updateProductSchema>