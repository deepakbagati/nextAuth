import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";

connect()

export async function POST(request:NextRequest){

    try{
        const reqBody=await request.json()
        const {token}=reqBody
        console.log(token)

        const user=await User.findOne({verificationToken:token,verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({error:"Invalid token"},{status:400})
         
        }
        user.verified=true
        user.verificationToken=undefined
        user.verificationTokenExpiry=undefined
        await user.save()

        return NextResponse.json({message:"Email verified successfully",success:true},{status:200})

}
catch(error:any){
    return NextResponse.json({error:error.message},{status:500})
}
}