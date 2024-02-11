// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import mongoose from "mongoose";
import ITour from "./interfaces/ITour.model";
import User from "./User.model";
import { populate } from "dotenv";


const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
        ,unique:[true,"It SHould be Unique"]
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        max:[5,"max average 5"]
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"Price Required"]
    },
    priceDiscount:{
        type:Number
    },
    duration:{
        type:Number,
        required:[true,"A Tour Must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"a Tour must have  group size"]
    },
    summary:{
        type:String,
        trim:true,
        required:[true,"a tour must have Summery"]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"a tour must have image cover"]
    },
    images:[
        String
    ],
    createAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    difficulty:{
        type:String,
        required:[true,"a Tour must have Difficulty"]
        ,
        enum:{
            values:['easy','medium','difficult'],
            message:"Difficulty only easy , medium and difficult Only"
        }
    },
    secretTour:{
        type:Boolean,
        default:false 
    },
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        address:String,
        description:String,
        coordinates:[Number],
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            description:String ,
            address:String ,
            coordinates:[Number],
            day:Number 
        }
    ],
    guides:[{
        type:mongoose.Types.ObjectId
        ,ref:"User"
    }],
    
},{
    toJSON:{virtuals:true}, toObject:{virtuals:true}
})

tourSchema.index({ startLocation: '2dsphere' });

//virtual populate
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

tourSchema.virtual('durationWeek').get(function(){
    return this.duration/7 ;
})

// tourSchema.static.

tourSchema.pre(/^find/,function(next){
    this.populate({path:'guides' , select:'-__v -passwordChangeAt -passwordConfirm'}).populate('reviews')
    next()
})
// Query Middleware
tourSchema.pre('find',function(next){
    this.find({secretTour:{$ne:true}})
    next();
})
tourSchema.pre('findOne',function(next){
    this.find({secretTour:{$ne:true}})
    next();
})
const Tour=mongoose.model<ITour>('Tour',tourSchema);

export default Tour