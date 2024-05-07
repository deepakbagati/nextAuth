require('dotenv').config();
import nodemailer from 'nodemailer';
import User from '@/models/user.models';
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        console.log("MAIL",userId);
        console.log("EMAIL type",emailType);
        console.log(typeof emailType);

        if (emailType === 'VERIFY') {

            const updatedUser = await User.findByIdAndUpdate(userId, {
                $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
            });
            console.log("updated user for verify", updatedUser);
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
            });
        }

        const transport = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '087b1890e04ff9', //not recommended
                pass: '1c90c8f08e2c0b' //not recommended
            }
        });

        const mailOptions = {
            from: 'deepak12@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }
        console.log("mailOptions", mailOptions);
        console.log("process.env.DOMAIN", process.env.DOMAIN);
        console.log(process.env);
        console.log("Hashed Token:", hashedToken);


        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
