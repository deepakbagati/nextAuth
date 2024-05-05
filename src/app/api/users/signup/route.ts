import {connect} from '@/dbConfig/dbConfig';
import User  from '@/models/user.models'
import {NextRequest,NextResponse} from 'next/server'    //data nextjs me lena ka tarika
import bcryptjs  from "bcryptjs"
import {sendEmail} from '@/helpers/mailer'
 
connect()

export async function POST(request: NextRequest){

try{
const reqBody= await request.json()
const {username,email,password}=reqBody

//validation



console.log(reqBody);

const user = await User.findOne({email})

if(user){
    return NextResponse.json ({error:"User already exists"},{status:400})
}
 //steps to generate hash as async..
const salt = await bcryptjs.genSalt(10)
const hashedPassword= await bcryptjs.hash(password,salt) //hashedPssword aagya yaha pe 

const newUser = new User ({
    username,
    email,
    password:hashedPassword
}) 

const savedUser=await newUser.save()
console.log(savedUser);

//send verification email
await sendEmail({email,emailType:"Verify",userId:savedUser._id})

return NextResponse.json({
    message:"User registered successfully",
    success:true,
    savedUser
})

}

catch(error:any){
return NextResponse.json({error: error.message},
 {status:500})

}
}