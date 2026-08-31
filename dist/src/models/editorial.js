import { Schema, model } from "mongoose";
const editorialSchema = new Schema({
    slot: { type: String, enum: ["editorial-1", "editorial-2"], required: true, unique: true },
    image1Url: { type: String, required: true },
    image2Url: { type: String },
    heading: { type: String, required: true },
    subheading: { type: String },
    discoverHref: { type: String },
}, { timestamps: true });
export const Editorial = model("Editorial", editorialSchema);
