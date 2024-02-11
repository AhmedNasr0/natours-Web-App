import { Request,Response,NextFunction } from 'express'
import catchAsyncError from "../utils/catchAsyncError"
import Review from "../Models/Review.model"
import customRequest from '../utils/CustomRequest'
import { createOne, deleteOne, getAll, getOne, updateOne } from './controllersFactory'
import AppError from '../utils/AppError'



export const createReview=createOne(Review);

export const getSingleReview=getOne(Review);

export const getAllReviews=getAll(Review);

export const deleteReview=deleteOne(Review);

export const updateReview=updateOne(Review);

// middlewares
export const forUserHimSelf=catchAsyncError(async(req:customRequest,res:Response,next:NextFunction)=>{
    const review:any=await Review.findById(req.params.id)
    if(req.user.id!= review.user._id) return next(new AppError("IT Allow only for User Himself",402));
    next()
})

export const checkUserTourIDs=catchAsyncError(async (req:customRequest,res:Response,next:NextFunction)=>{
    if(!req.body.user) req.body.user=req.user.id 
    if(!req.body.tour) req.body.tour=req.params.tourId
    next()
})