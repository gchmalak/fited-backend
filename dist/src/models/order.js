import { model, Schema } from "mongoose";
// -----------------orderItem schema-------------------------
const orderItemSchema = new Schema({
    priceAtPurchase: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: true });
// -------------------IOrder schema-----------------------------------
const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    wilaya: { type: String, required: true },
    postalCode: { type: String },
    deliveryNotes: { type: String },
}, { timestamps: true });
export const Order = model("Order", orderSchema);
