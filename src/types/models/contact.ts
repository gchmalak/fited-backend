import { Document } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageDocument = Document & IContactMessage;