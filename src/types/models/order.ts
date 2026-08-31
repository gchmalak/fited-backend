// -----------------IOrderItem---------------------------

import { Document, Types } from "mongoose";

// here data needs to be frozen at the time of purchase so if the price changes later it wont affect this purchase
export interface IOrderItem{
    _id:string;
    priceAtPurchase:number;
    product:Types.ObjectId;
    variantId:string;
    quantity:number;

}

// ------------IOrder-----------------------------------------------
export interface IOrder{
    orderId:string;
    userId:Types.ObjectId; //info of the person who placed the order this gets their info without having to copy all of it ex:name,number.....
    items:IOrderItem[];
    fullName: string;
    phone: string;
    street: string;
    city: string;
    wilaya: string;
    postalCode?: string;
    deliveryNotes?: string;

    totalPrice:number;
    status:"pending"|"shipped"|"delivered"|"cancelled";
    address:string; //supposed to be an object of sr=treet ,city,country...
    createdAt:Date;
    updatedAt:Date;

}

export type OrderDocument= Document & IOrder;