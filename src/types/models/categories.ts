import { Document } from "mongoose";
import { ProductDepartment } from "./product.js";

export interface ISubcategory{
    _id:string;
    name:string;
}

export interface ICategory{
    name:string;
    department : ProductDepartment; //as we should know to which department the category belongs 
    subcategories:ISubcategory[];
  
}
export type CategoryDocument = Document & ICategory;