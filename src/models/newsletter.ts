import { model, Schema } from "mongoose";

export interface INewsletterSubscriber {
  email: string;
  subscribedAt: Date;
}

const newsletterSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const NewsletterSubscriber = model<INewsletterSubscriber>(
  "NewsletterSubscriber",
  newsletterSchema,
);