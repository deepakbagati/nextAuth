import nodemailer from 'nodemailer'
import User from '@/models/user.models'
import bcryptjs from "bcryptjs"

export   const sendEmail   = async({email,emailType,userId}:any)=>{
    try{
       const hashedToken=await bcryptjs.hash(userId.toString(),10)

       if(emailType==='Verify'){
           await User.findByIdAndUpdate(userId,
            {verifyToken: hashedToken ,verifyTokenExpiry:Date.now()+3600000})

       }
       else if
       (emailType==='Reset'){
           await User.findByIdAndUpdate(userId,
            {forgotPasswordToken: hashedToken ,forgotPasswordTokenExpiry:Date.now()+3600000})
       }
       

       var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "087b1890e04ff9",//not recommended
          pass: "1c90c8f08e2c0b"//not recommended
        }
      });

          const  mailOptions={
            from: "deepak@deepak.ai" , // sender address
            to: email, //  user email
            subject: emailType==='Verify' ? "Verify your email" : "Reset Password",      
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
          }
           const  mailResponse =  await transport.sendMail(mailOptions)
          return mailResponse


    }
    catch(error:any){
        throw new Error(error.message)
    }
}