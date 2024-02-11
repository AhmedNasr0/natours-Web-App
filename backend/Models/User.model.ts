import mongoose from "mongoose";
import { IUser } from "./interfaces/IUser.model";
import AppError from "../utils/AppError";
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const UserSchema=new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name Is Required"]
    },
    email: {
        type: String,
        required: [true, "email Is Required"],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail,"Not Valid Email!!"]
    },
    password: {
        type: String,
        required: [true, "password Is Required"],
        min:8,
        select:false 
    },
    passwordConfirm: {
        type: String,
        required: [true, "password Confirmation Is Required"],
    },
    photo: {
        type: String,
        default:''
    },
    passwordChangeAt:{
        type:Date ,
        default:null
    },
    role:{
        type:String,
        enum:['user','guid','lead-guid','admin'],
        default:'user'
    }
    ,
    passwordResetToken:String ,
    passwordResetExpire:Date,
    active:{
        type:Boolean,
        default:true
    }
})
// validate equality of password and confirmPassword
UserSchema.pre("save",async function(next){
    if(this.password && this.passwordConfirm) {
        if(this.password !== this.passwordConfirm) throw new AppError('Password does not Match , TryAgain',403)
    }
    next()
})
// hash Password
UserSchema.pre("save",async function(next){
    // run this function only when password modified 
    if(!this.isModified('password')) return next()
    // hash password before it save on DB
    this.password=await bcrypt.hash(this.password,12)
    //remove passwordConfirm from DB
    this.passwordConfirm = undefined as any
    next()
})

UserSchema.pre('save',function(next){
    if(!this.isModified('password')|| this.isNew) return next()
    this.passwordChangeAt=Date.now() -1000 as unknown as Date //
    next()
})
UserSchema.pre(/^find/,function(next){
    (this as any).find({active:{$ne:false}})
    next()
})

//instance method 
UserSchema.method('correctPassword',async function correctPassword(password: any,hashPassword: any){
    return await bcrypt.compare(password,hashPassword);
})

UserSchema.method('ChangePasswordAt', function ChangePasswordAt(JWTTimeStamp): boolean {
    if(this.passwordChangeAt){
            const changedTimeStamp:any=this.passwordChangeAt.getTime() /1000 
                parseInt(changedTimeStamp,10);
                 return JWTTimeStamp < changedTimeStamp
             }
    return false 
});

// generate reset Token to make sure that the person who change password is the same user
UserSchema.method('createPasswordResetToken',function createPasswordResetToken():string{
    // 1) generate reset Token
    const resetToken=crypto.randomBytes(32).toString("hex");

    // 2) set passwordReset Token for user = To the reset token we generated
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 3) Set expire Date for our reset Token to amke it for 10 min only 
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000 as unknown as Date 

    // 4) return it 
    return resetToken 
})

const User=mongoose.model<IUser>("User",UserSchema);
export default User 