import { model, Schema } from "mongoose";
import { IOrder, IOrderItem } from "../types/models/order.js";
// -----------------orderItem schema-------------------------
const orderItemSchema= new Schema<IOrderItem>({
priceAtPurchase:{type:Number, required:true},
product:{type:Schema.Types.ObjectId, ref:"Product",required:true},
variantId:{type:String,required:true},
quantity:{type:Number, required:true},
},{_id:true})
// -------------------IOrder schema-----------------------------------
const orderSchema = new Schema<IOrder>({
    userId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    items:[orderItemSchema],
    totalPrice:{type:Number, required:true},
    status:{type:String, enum:["pending", "shipped", "delivered", "cancelled"],default:"pending", required:true},
    address:{type:String,required:true}
},{timestamps:true}
)

export const Order = model<IOrder>("Order",orderSchema)