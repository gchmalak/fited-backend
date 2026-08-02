import { Document } from "mongoose";

// ----------------------IUser interface-------------------------------------------------
export interface IUser{
    email:string;
    username:string;
    password:string;
    role:"admin"|"user";
    avatarUrl?:string;
    bio?:string;
    createdAt:Date;
    updatedAt:Date;
    isAdmin:boolean;
    isActive:boolean;
}


// -------------IUserMethods interface-------------------------------------------
export interface IUserMethods{
    comparePassword(plain:string):Promise<boolean>;
}


export type UserDocument  = IUser & IUserMethods & Document;