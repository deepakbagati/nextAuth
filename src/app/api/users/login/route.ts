import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request:NextRequest){
    try{
        const reqBody=await request.json()
        const {email,password}=reqBody;
        console.log(reqBody);

        //check if user exists
        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"user does not exist"},{status:400})
        }
        console.log("user exists")
        //check if password is correct

        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);

        //create token

        const tokenData={
            id:user._id,
            email:user.email,
            username:user.username
        }
        const token =await jwt.sign(tokenData,process.env.TOKEN_SECRET !,{expiresIn:"1d"})

        const response=NextResponse.json({
            message:"Login successful",
            success:true
        })

        response.cookies.set("token",token,{
            httpOnly:true, //storing user data on the web
        })

        return response;
}
    catch(error:any){
            return NextResponse.json({error:error.message},{status:600})
        }
}