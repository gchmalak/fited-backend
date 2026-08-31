import { model, Model, Schema } from "mongoose";
import { IUser, IUserMethods } from "../types/models/user.js";
import bcrypt from "bcryptjs";

type UserModel = Model<IUser, Record<string,never>,IUserMethods>;

const userSchema = new Schema<IUser,UserModel,IUserMethods>(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,

        },

        
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,


        },
        password:{
            type:String,
            required:true,
        },
        resetPasswordTokenHash: { type: String },
        resetPasswordExpires: { type: Date },
        role: { type: String, enum: ["owner", "admin", "user"], default: "user" },
        avatarUrl: {type: String,},
        
        bio:{type:String},
        isActive: { type: Boolean, default: true },
        wishlist: [
    {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
],
    },
    {
        timestamps :true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true},

    },

);
userSchema.virtual("isAdmin").get(function (this: IUser) {
  return this.role === "admin" || this.role === "owner";
});
userSchema.virtual("isOwner").get(function (this: IUser) {
  return this.role === "owner";
});
userSchema.pre("save", async function(){
    if(this.isNew || this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
});
userSchema.methods.comparePassword = async function (requestedPassword:string,):Promise<boolean> {
    return bcrypt.compare(requestedPassword, this.password)
}
export const User = model<IUser, UserModel>("User",userSchema);