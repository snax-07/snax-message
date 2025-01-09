import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerficationEmail(email : string , username : string , verifyCode : string):Promise<ApiResponse>{
    try {
            await resend.emails.send({
                from : 'onboarding@resend.dev',
                to : email,
                subject : 'Snax Mystery | Verification Code ',
                react : VerificationEmail({username : username , otp : verifyCode })
            })
            return {success : true , message : 'Verification email send successfully'}
    } catch (emailError) {
        console.log("Error sending verification email" , emailError)
        return {success : false , message : 'Failed to to send verificatin email'}
    }
}