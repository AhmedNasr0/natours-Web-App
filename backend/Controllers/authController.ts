import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import User from "../Models/User.model";
import { generateToken } from "../utils/generateToken";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/verifyToken";
import sendEmail from "../utils/email";
import customRequest from "../utils/CustomRequest";
const crypto=require('crypto')




export const signup=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
        const user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
        })
        const token=await generateToken({id:user._id});

        res.status(200).json({
            status:'success',
            token,
            data:{
                user
            }
        })
})

export const login=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body 
    //check if email and password exist
    if(!email || !password) return next(new AppError('Please enter Email and Password',400));

    //check if User found 
    
    const user:any=await User.findOne({email}).select('+password');
    if(user==null) return next(new AppError("Email Not Found",403))
    // check if password correct
    if(!user || !( await user.correctPassword(password,user.password))) return next(new AppError('Email or password is not correct ',401))
    
    // generate Token
    const token=await generateToken({id:user._id});
    res.status(200).json({
        status:'success',
        token,
        data:{
            user 
        }
    })
})

export const forgetPassword=catchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    // check if email exist
    const user:any=await User.findOne({email:req.body.email})
    if(!user) return next(new AppError('email not found',404))

    // generate random reset Token 
    const resetToken:string=await user.createPasswordResetToken()
    // save reset token on document 
    // validate before save == false => it mean to disable all validation of document because we just update document not create a new one
    await user.save({validateBeforeSave:false});

    // send email 
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
    const message=`forget password submit your new password on this website ${resetURL}, if u didnt do that please ignore this email `
    try{
        await sendEmail({
            email:user.email,
            subject:'Your password reset token {valid for 10 min}',
            message:message
        })
        res.status(200).json({
            status:'success',
            message:'Email sent Successfully , check Your email'
        })
    }catch(err){
        user.passwordResetToken=undefined,
        user.passwordResetExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new AppError('there was an error while sending email , TryAgain ',500))
    }

})

export const resetPassword=catchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    // decode token 
    const hashedtoken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
    const user:any=await User.findOne({passwordResetToken:hashedtoken,passwordResetExpire:{$gt:Date.now()}})

    // check if user token expired or not 
    if(!user) return next(new AppError('Token is invalid or it Expired',400))
    user.password=req.body.password 
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetToken=undefined 
    user.passwordResetExpire=undefined
    await user.save(); // save user data and validate this input data

    // log user 
    const token=generateToken({id:user._id});  
    
    res.status(200).json({
        status:'success',
        token 
    })

})

export const updatePassword=catchAsyncError(async (req:customRequest,res:Response,next:NextFunction)=>{
    let user:any= await User.findById(req.user.id).select('+password')
    if(!user) return next(new AppError('its not for U',400))

    // check for old password and check if it correct 
    let currentPassword=req.body.password
    if(!user.correctPassword(currentPassword,user.password)) return next(new AppError('Password Incorrect, TryAgain',401))

    // if correct , update password 
    user.password=req.body.password 
    user.passwordConfirm=req.body.passwordConfirm
    await user.save();

    // generate new jwt token
    const token=generateToken({id:req.user.id})
    res.status(200).json({
        status:'success',
        token
    })
})
 
export const protectRoute=catchAsyncError(async(req:customRequest,res:Response,next:NextFunction)=>{
    let token
    if(req.headers.authorization )
    {
        token=req.headers.authorization
    }
    if(!token) return next(new AppError("You are not logged in ,please login to get access",401))
    
    //verify token 
    const decode:any=await verifyToken(token) ;

    //check if user still exist
    const user:any=await User.findById(decode.id);
    if(!user) return next(new AppError('the token belong to this user does not exist',401))

    // check if use change password after token was generated
    if(await user.ChangePasswordAt(decode.iat)){
        return next(new AppError('User Recently Change Password , Please Try Again.',401))
    }
    req.user=user 
    next()
})
export function restrictTo(...roles: any[]){
    return (req:customRequest,res:Response,next: NextFunction)=>{
        if(!roles.includes(req.user.role)) return next(new AppError('You dont have any permission To access this action',403))
        next()
    }
}

