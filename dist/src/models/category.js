import { model, Schema } from "mongoose";
import { DEPARTMENTS } from "../types/models/product.js";
const subcategorySchema = new Schema({
    name: { type: String }
}, { _id: true });
const categorySchema = new Schema({
    name: { type: String, required: true },
    department: { type: String, enum: DEPARTMENTS, required: true },
    subcategories: [subcategorySchema],
}, { timestamps: true });
export const Category = model("Category", categorySchema);
