import { model, Schema } from "mongoose";
import { ICart, ICartItem } from "../types/models/cart.js";
// -------------cartItemSchema---------------------------

const cartItemSchema= new Schema <ICartItem>({
product:{type:Schema.Types.ObjectId,ref:"Product", required:true},
variantId:{type:String,required:true},
quantity:{type:Number, required:true}
},{_id:true})

// -------------------Cart Schema-----------------------------
const cartSchema = new Schema<ICart>({
userId:{type:Schema.Types.ObjectId,ref:"User", required:true},
cartItems:[cartItemSchema],
totalItems:{type:Number,default:0},
totalPrice:{type:Number,default:0}
},{timestamps:true})


export const Cart = model<ICart>("Cart",cartSchema)