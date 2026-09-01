import { Counter } from "../models/counter.js";

export async function getNextSequence(name:string):Promise<number>{
    const counter = await Counter.findByIdAndUpdate(
        name,
        {$inc:{seq:1}},
        {new:true, upsert:true}
    )
    return counter!.seq
}
