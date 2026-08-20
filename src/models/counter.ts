import { model, Schema } from "mongoose";
import { ICounter } from "../types/models/counter.js"


const counterSchema = new Schema<ICounter>({
    _id:{type:String},
    seq:{type:Number,default:0}
})
export const Counter = model<ICounter>("Counter", counterSchema)