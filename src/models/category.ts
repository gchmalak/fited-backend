import { model, Schema } from "mongoose";
import { ICategory, ISubcategory } from "../types/models/categories.js";
import { DEPARTMENTS } from "../types/models/product.js";

const subcategorySchema = new Schema<ISubcategory>({
    name:{type:String}
},{_id:true})

const categorySchema = new Schema<ICategory>({
    name:{type:String,required:true},
    department:{type:String, enum:DEPARTMENTS, required:true},
    subcategories:[subcategorySchema],

    },{timestamps:true})
    export const Category = model<ICategory>("Category", categorySchema);