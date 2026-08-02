import { model, Schema } from "mongoose";
import { CATEGORIES, DEPARTMENTS, IProduct, IReview, IVariant } from "../types/models/product.js";



const variantSchema = new Schema<IVariant>({
size:{
    type:String, required:false
},
color:{type:String, required:false},
shade:{type:String, required:false},
stock:{type:Number , required:true,default:0},
sku:{type:String, required:true},
},{_id:true})

const reviewSchema = new Schema<IReview>({
    authorId:{type:Schema.Types.ObjectId, ref:"User", required:true},
rating:{type:Number,required:true},
comment:{type:String,required:true},
createdAt:{type:Date,required:true}
},{_id:true})

const productSchema = new Schema<IProduct>({
    name:{type:String,required:true},
description:{type:String,required:true},
images:{type:[String], required:true},
brand:{type:String,required:true},
department:{type:String, enum:DEPARTMENTS, required:true},
category:{type:String,enum:CATEGORIES,required:true},
price:{type:Number, required:true},
variants:[variantSchema],
reviews:[reviewSchema],
averageRating:{type:Number,default:0},
reviewCount:{type:Number,default:0},
authorId:{type:Schema.Types.ObjectId, ref:"User",required:true},
isActive:{type:Boolean,default:true},



},{timestamps:true})

export const Product =model<IProduct>("Product", productSchema);