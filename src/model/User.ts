import  mongoose, {Schema , model , Document, models} from "mongoose";




export interface Message extends Document {
    content : string;
    createdAt : Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content : {type : String , required : true},
    createdAt : {type : Date , default : Date.now, required : true}
});



export interface User extends Document {
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages : Message[];
}


const UserSchema: Schema<User> = new Schema({
    username : {type : String ,unique : true, required : true , trim : true},
    email : {type : String , required : true , unique : true , match : [/.+@.+..+/, 'PLease use valid email address']},
    password : {type : String , required : [true , 'password is required']},
    verifyCode : {type : String , required : [true  , 'verify code is required']},
    verifyCodeExpiry : {type : Date , required : [true , 'expiry is required']}, 
    isVerified : {type : Boolean , default : false },
    isAcceptingMessage : {type : Boolean , default : true},    
    messages : [MessageSchema]
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || model<User>('User' , UserSchema)


export default UserModel