// it counts productId so basically number of products

import { Document } from "mongoose";

export interface ICounter {
    _id: string;//the counter's name ex: "productId"
    seq:number ; //the current sequence number
}
export type CounterDocument = Document & ICounter;