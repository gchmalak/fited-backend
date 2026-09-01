import { Document, Types } from "mongoose";

// ---------------------- IUser interface ----------------------
export interface IUser {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;

  role: "owner" | "admin" | "user";

  avatarUrl?: string;
  bio?: string;

  isActive: boolean;

  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;

  wishlist: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

// ---------------------- IUserMethods interface ----------------------
export interface IUserMethods {
  comparePassword(plain: string): Promise<boolean>;
}

export type UserDocument = IUser & IUserMethods & Document;