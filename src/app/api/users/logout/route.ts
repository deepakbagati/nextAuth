import { NextResponse } from "next/server";


export async function GET(){
    try{
        const response=NextResponse.json({
            message:"Logout successful",
            success:true
        })
        response.cookies.set("token","",
        {httpOnly:true,expires:new Date(0)});
        
//{ httpOnly: true }: Sets the httpOnly flag to true, indicating that the cookie should only be accessible via HTTP requests and not through client-side scripts (e.g., JavaScript). This enhances security by preventing certain types of attacks, such as cross-site scripting (XSS).

        return response
    }
    catch(error:any){
        return NextResponse.json({message:error.message,success:false})
    }
}