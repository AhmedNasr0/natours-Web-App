import {NextFunction, Request,RequestHandler,Response} from 'express'
import catchAsyncError from '../utils/catchAsyncError';
import User from '../Models/User.model';
import customRequest  from '../utils/CustomRequest';
import { deleteOne, getAll, getOne, updateOne } from './controllersFactory';

export const getAllUsers =getAll(User);

export const getUser=getOne(User);

export const updateUser=updateOne(User);

export const updateMe =updateOne(User)

export const deleteMe=catchAsyncError(async (req:customRequest,res:Response,next:NextFunction)=>{
    
    const user=await User.findByIdAndUpdate(req.user.id,{active:false},{
      new:true,
      runValidators:true 
    })
    
    res.status(200).json({
      status:"success",
      data:{
        user
      }
    })
})
export const deleteUser=deleteOne(User);

//middleware 
export const getMe=(req:customRequest,res:Response,next:NextFunction)=>{
  req.params.id=req.user.id
  console.log(req.params.id);
  next()
}