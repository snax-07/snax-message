import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username , code } = await request.json();
        const deodedUsername = decodeURIComponent(username);
        const User = await UserModel.findOne({username : deodedUsername});

        if(!User){
            return Response.json({
                success : false,
                message : "Error user not found"
            })
        }

        const isCodeValid = User.verifyCode === code
        const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            User.isVerified = true;
            await User.save()

            return Response.json({
                success : true,
                message : "User verified Successfully"
            } , {status : 201})
        }else if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message : "Verififcation code is expired , please sign up again"
            } , {status : 501})
        }else {
            return Response.json({
                success : false,
                message : "Incorrect verification code"
            } , {status : 501})
        }


    } catch (error) {
        return Response.json({
            success : false,
            message : "Error otp validation"
        } , {status : 500})   
    }
}