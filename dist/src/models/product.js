import { model, Schema } from "mongoose";
import { DEPARTMENTS } from "../types/models/product.js";
const variantSchema = new Schema({
    size: {
        type: String, required: false
    },
    color: { type: String, required: false },
    shade: { type: String, required: false },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true },
}, { _id: true });
const reviewSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, { _id: true });
const productSchema = new Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    brand: { type: String, required: true },
    department: { type: String, enum: DEPARTMENTS, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    variants: [variantSchema],
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const Product = model("Product", productSchema);
