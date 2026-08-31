import { Document } from "mongoose";

export interface INewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsletterSubscriberDocument = Document & INewsletterSubscriber;