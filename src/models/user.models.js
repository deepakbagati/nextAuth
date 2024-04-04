import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Provide  a username"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Please provide your email id"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        unique:true

    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date

})

const User=mongoose.models.users || mongoose.model("users",userSchema);//nextJs works on edge so it doesnt know it is making 1st time oonnec or 2nd,3rd.

export default User;