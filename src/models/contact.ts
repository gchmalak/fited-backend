import { model, Schema } from "mongoose";
import { IContactMessage } from "../types/models/contact.js";

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["customer", "admin"],
          required: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const ContactMessage = model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema,
);