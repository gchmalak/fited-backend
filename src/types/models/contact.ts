import { Document } from "mongoose";

export type ContactMessageSender = "customer" | "admin";

export interface IContactChatMessage {
  sender: ContactMessageSender;
  message: string;
  createdAt: Date;
}

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  messages: IContactChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageDocument = Document & IContactMessage;