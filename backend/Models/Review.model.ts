// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import mongoose from "mongoose";
import { IReview } from "./interfaces/IReview.model";
import Tour from "./Tour.model";


const reviewSchema=new mongoose.Schema({
    review:{
        type:String
        ,required:[true,"Review cant be empty"]
    },
    rating:{
        type:Number ,
        required:[true,"Rating Required."],
        min:1,
        max:[5,"Rating between 0-5 "]
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Types.ObjectId
        ,ref:'User',
        required:[true,"Review must belong to User"]
    },
    tour:{
        type:mongoose.Types.ObjectId,
        ref:"Tour",
        required:[true,"Review must belong to Tour"]
    }
},{toJSON:{virtuals:true} , toObject:{virtuals:true}}
)

// index
reviewSchema.index({tour:1 , user:1} ,{unique:true});

reviewSchema.static('calcAvgRatings',async function(tour){
    const stats=await this.aggregate([    
        {
            $match:{tour:tour}
        },
        {
            $group:{
                _id:'$tour',
                numOfRatings:{$sum:1},
                avgRatings:{$avg:'$rating'}
            }
        }
    ])
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tour,{
            ratingsAverage:stats[0].avgRatings,
            ratingsQuantity:stats[0].numOfRatings
        })
    }
    else{
        await Tour.findByIdAndUpdate(tour,{
            ratingsAverage:4.5, // as deafult
            ratingsQuantity:0
        })
    }
})
// for re calculate Tour rating and quantity Average after update or delete 
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.clone().findOne(); // this.r it mean to save it as prperty to use it in post midle ware , it because we cant pass usual variable
    next()
})
reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAvgRatings(this.r.tour);
})
// calc Tour Rating and Quantity Average after save it
reviewSchema.post('save',function(){
    this.constructor.calcAvgRatings(this.tour);
})

reviewSchema.pre(/^find/,function(next){
    this.populate('user')
    next()
})

const Review = mongoose.model<IReview>('Review',reviewSchema);
export default Review 



