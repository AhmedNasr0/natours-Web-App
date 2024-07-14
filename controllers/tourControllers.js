const tourModel=require('../models/tourModel');
const ApiFeature = require('../utils/APIFeature.js');
const catchAsyncfn = require('../utils/catchAsyncFn.js');
const {getAll,getOne,createOne,updateOne,deleteOne} =require('./controllerFactory.js')
const fs = require('fs');
const multer=require('multer')


exports.aliasTourTopCheap = (req, res, next) => {
  req.query.limit='5'
  req.query.sort='-ratingsAverage,price'
  req.query.fields='name,price,ratingsAverage,summary,difficulty'

  next();
};

exports.getAllTours = getAll(tourModel)

exports.getTour = getOne(tourModel)

exports.createTour = createOne(tourModel)

exports.updateTour = updateOne(tourModel)

exports.deleteTour = deleteOne(tourModel)

exports.TourStats=catchAsyncfn(async(req,res)=>{
    const stats=await tourModel.aggregate([
      {
        $match:{
          ratingsAverage:{$gte:4.5}
        }
      },
      {
        $group:{
            _id:'$difficulty',
            totalNumberOfRatings:{$sum:'$ratingsQuantity'},
            totalNumberOfTours:{$sum:1},
            avgRating:{$avg:'$ratingsAverage'},
            avgPrice:{$avg:'$price'},
            minPrice:{$min:'$price'},
            maxPrice:{$max:'$price'}
        }
      },
      {
        $sort:{
          avgPrice:1
        }
      }
    ])
    res.status(200).json({
      status:"success",
      data:{
        stats
      }
    })
})
exports.MonthlyPlan=catchAsyncfn(async(req,res)=>{
    const year=req.params.year*1
    const tours=await tourModel.aggregate([
      {
        $unwind:'$startDates'
      },  
      {
          $match:{
            startDates:{
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
      },
      {
        $group:{
            _id:{ $month:'$startDates'},
            tourNums:{$sum:1},
            tours:{
              $push:'$name'
            }
        }
      },
      {
          $addFields:{ month:'$_id'}
      },
      {
        $sort:{
            month:1
        }
      },
      {
        $project:{
            _id:0
        }
      },
      {
        $limit:12
      }
    ])
    res.status(200).json({
      status:"success",
      data:{
        tours 
      }
    })
})

exports.getTourWithin=catchAsyncfn(async (req,res,next)=>{
  const {distance,latlng,unit}=req.params
  const [lat,lng]=latlng.split(',');
  const radius=unit==='mi'?distance/3963.2 : distance / 6378.1
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }
  const tours=await tourModel.find({startLocation:{  $geoWithin : { $centerSphere : [[lng,lat],radius] } } } ) 
  res.status(200).json({
    status:"success",
    results:tours.length,
    data:{
      data:tours 
    }
  })
})
exports.getDistance=catchAsyncfn(async (req,res,next)=>{
  const {distance,latlng,unit}=req.params
  const [lat,lng]=latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const tours=await tourModel.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },{
      $project:{
        distance:1,
        name:1
      }
    }
  ])
  res.status(200).json({
    status:"success",
    results:tours.length,
    data:{
      data:tours 
    }
  })
})

const multerStorage= multer.memoryStorage()
const upload=multer({
  Storage:multerStorage
})

exports.uploadTourImages=upload.fields([
  {name:'imageCover',maxCount:1},
  {name:'images',maxCount:3}
])


