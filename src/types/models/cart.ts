import { Document, Types } from "mongoose";

// -------------ICartItem interface=specific for items of the cart--------------------------------
export interface ICartItem{
_id:string;//id for cart item to be able to remove or add it from the cart
    product:Types.ObjectId;
    variantId:string;
 quantity:number;//number of items 
}


// -------------ICart interface---------------------------------------
export interface ICart{
userId:Types.ObjectId;
cartItems:ICartItem[];
createdAt:Date;
updatedAt:Date;
totalPrice:number;
totalItems:number;
}
 export type CartDocument = Document & ICart ;