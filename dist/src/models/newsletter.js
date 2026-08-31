import { model, Schema } from "mongoose";
const newsletterSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const NewsletterSubscriber = model("NewsletterSubscriber", newsletterSchema);
