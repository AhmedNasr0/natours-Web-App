import mongoose, { Model } from "mongoose";
import catchAsyncError from "../utils/catchAsyncError";
import { Request, Response,NextFunction } from "express";
import AppError from "../utils/AppError";
import APIFeature from "../utils/APIFeatures";

export const deleteOne=<T>(model:Model<T>)=>
    catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
        const id=req.params.id 
        const doc=await model.findOneAndDelete({_id:id})
        if(!doc) return next(new AppError('No Document Found with this id',404));
        res.status(200).json({
        status:"success",
        data:{
            data:doc
        }
        })
  })

export const updateOne=<T>(model:Model<T>)=>
    catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
        const id=req.params.id 
        const doc=await model.findOneAndUpdate({_id:id},req.body,{
          new:true , runValidators:true 
        })
        if(!doc) return next(new AppError('No Document Found with this id',404));
        res.status(200).json({
          status:"success",
          data:{
            data:doc
          }
        })
      }) 

export const createOne=<T>(model:Model<T>)=> catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
    const doc=await model.create(req.body);
    
    res.status(200).json({
      status:'success',
      data:doc
    })
})

export const getOne=<T>(model:Model<T>,populateOption?:any)=> catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
    const id = req.params.id;
    if(populateOption) await model.findById({_id:id}).populate(populateOption)
    const doc= await model.findById({_id:id})
    if(!doc) return next(new AppError('No Tour Found with this id',404));
    res.status(200).json({
      status: 'success',
        data: doc 
      
      })
})

export const getAll=<T>(model:Model<T>)=>catchAsyncError(async (req:Request,res:Response)=>{  
    let filter:object ={}
    if(req.params.tourId) filter={ tour:req.params.tourId}

    const features=new APIFeature(model.find(filter),req.query).filter().sort().field().pagginate()
    const docs = await features.mongoQuery
    const docsNum=docs.length
    res.status(200).json({
        status:'success',
        resultNumber:docsNum,
        data:docs
    })
  })