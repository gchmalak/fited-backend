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
        role:{type:String,enum:["admin","user"], default:"user"},
        avatarUrl:{type:String},
        bio:{type:String},
    isActive: { type: Boolean, default: true },
    },
    {
        timestamps :true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true},

    },

);
userSchema.virtual("isAdmin").get(function(){
    return this.role=== "admin";

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