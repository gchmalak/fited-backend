import { Document, Types } from "mongoose";


export const DEPARTMENTS=[
    "Clothing",
    "Makeup",
    "Skincare",
    "Accessories",
    "Perfume",

] as const;

export type ProductDepartment = (typeof DEPARTMENTS)[number];

export interface IVariant {
    _id: string;
    size?:string;
    color?:string;
    shade?:string;
    stock:number;
    sku:string;//for stock tracking 

}
export interface IReview{
    _id:string;
    authorId:Types.ObjectId;
    rating:1|2|3|4|5;
    comment:string;
    createdAt:Date;

}
export interface IProduct{
    productId: string; // human-readable ID, e.g. "PRD-00001", auto-generated
    name:string;//product name
    description:string;//product description
   images:string[]//array bcs multiple pictures
   brand:string;
   department:ProductDepartment;
   categoryId:Types.ObjectId;
   subcategory:string;
   price:number;
   variants:IVariant[];
   reviews:IReview[];
   averageRating:number;
   reviewCount:number;
   authorId:Types.ObjectId;

   isActive:boolean;//so that admin can hide the product if out of stock without deleting it completely
   createdAt:Date;
   updatedAt:Date;
}
export type ProductDocument = Document & IProduct;
