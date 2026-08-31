import { Counter } from "../models/counter";
export async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
}
