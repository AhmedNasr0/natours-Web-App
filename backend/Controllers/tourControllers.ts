import {Response,NextFunction, Request, request} from 'express'
import Tour from '../Models/Tour.model';
import mongoose, { Query } from 'mongoose';
import APIFeature from '../utils/APIFeatures';
import catchAsyncError from '../utils/catchAsyncError';
import AppError from '../utils/AppError';
import { createOne, deleteOne, getAll, getOne, updateOne } from './controllersFactory';

export const getTop5Cheap=catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
    req.query.limit='5'
    req.query.sort='-ratingsAverage,price'
    req.query.field='name,price,ratingsAverage,summary,difficulty'
    next()
})

export const getTourStats=catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
  const tour=await Tour.aggregate([
    {
      $match:{ ratingsAverage:{$gte:4.7}}
    }
    ,{
      $group:{
        _id:'$difficulty',
        num_RatingQuantity:{$sum:'$ratingsQuantity'},
        num_Sum_Ratings:{$sum:'$ratingsAverage'}
        ,average_Ratings:{$avg:'$ratingsAverage'}
        ,PriceAvg: { $avg:'$price' }
        ,minPrice:{$min:'$price'}
        ,maxPrice:{$max:'$price'}
      }
    },
    {
      $sort:{PriceAvg:1}
    }
  ])
  res.status(200).json({
    status: 'success',
      data: {
        tour
    }
    })
})
export const monthlyPlane=catchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
      const year:number=(req.params.year as any)*1
      const tour=await Tour.aggregate([{
          $unwind:'$startDates'
        },
        {
          $match:{
            startDates:{
              $gte:  new Date(`${year}-01-01`)
              ,
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group:{
            _id:{$month:'$startDates'},
            numsToursStart:{$sum:1},
            tours:{ $push:'$name'}
          }
        },{
          $addFields:{month:'$_id'}
        },
        {
          $project:{
            _id:0
          }
        },
        {
          $sort:{numsToursStart:-1}
        }
    ])
    res.status(200).json({
    status: 'success',
      data: {
        tour
    }
    })
})
export const getTourWithin=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
 
  const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1;
 
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng'
      ,400)
    );
  }
 
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
 
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

export const getDistance=catchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
  const {latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
 
  const multiplier=unit==='mi'? 0.000621371:0.001
 
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng'
      ,400)
    );
  }
 
  const tours = await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[+lng,+lat]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },
    {
      $project:{
        distance:1,
        name:1,
        _id:0
      }
    }
  ])
 
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
})

export const getAllTour=getAll(Tour);

export const getTour=getOne(Tour);

export const createTour = createOne(Tour);
  
export const updateTour =updateOne(Tour);
  
export const deleteTour =deleteOne(Tour)