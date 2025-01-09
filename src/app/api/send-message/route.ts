import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from "@/model/User";


export async function POST(request : Request) {
    await dbConnect();
    const {username , content} = await request.json();
  try {
    const user = await UserModel.findOne({username})

    if(!user){
        return Response.json({
            success : false,
            message : "User not found"
        } , {status : 404})
    }

    //check acceptance

    if(!user.isAcceptingMessage){
        return Response.json({
            success : false,
            message : "User is not accepting message"
        } , {status : 403})
    }

    const newMessage = {createdAt : new Date() , content}

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json({
        success : true,
        message : "Message sent"
    } ,{ status  : 200})
  } catch (error) {
    console.log("Unexpected error", error);
        return Response.json({
            success : false,
            message : "An error occured"
        } , {status : 500
        })
  }
    
}