import { Schema, model } from "mongoose";
import { IEditorial } from "../types/models/editorial.js";

const editorialSchema = new Schema<IEditorial>({
  slot: { type: String, enum: ["editorial-1", "editorial-2"], required: true, unique: true },
  image1Url: { type: String, required: true },
  image2Url: { type: String },
  heading: { type: String, required: true },
  subheading: { type: String },
  discoverHref: { type: String },
}, { timestamps: true });

export const Editorial = model<IEditorial>("Editorial", editorialSchema);