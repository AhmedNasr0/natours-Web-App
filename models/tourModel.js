const { default: mongoose } = require("mongoose");

const TourSchema=new mongoose.Schema({
    name:{type:String , required:[true,"Name Required"]},
    duration:{
        type:Number,
        required:[true,"Duration Required"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"groupSize Required"]
    },
    difficulty:{
        type:String,
        required:[true,"Difficultly Required"],
        enum:['easy','medium','difficult']
    },
    ratingsQuantity:{
        type:Number,
        default:4.5
    },
    ratingsAverage:{
        type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    priceDiscount:{
        type:Number
    },
    price:{
        type:Number,
        required:[true,"Price Is Required"]
    },
    summery:{
        type:String,
        trim:true 
    },
    description:{
        type:String,
        trim:true 
    },
    imageCover:{
        type:String,
        required:[true,"Tour must Have a CoverImage"]
    },
    images:[String],
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Types.ObjectId,
            ref:'user'
        }
    ]
},{timestamps:true , toJSON:true,toObject:true})
TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ startLocation: '2dsphere' }) // to perform a efficient queries for geo location
TourSchema.pre(/^find/,function(next){
    this.populate('guides')
    next()
})

const tourModel=mongoose.model('Tour',TourSchema)
module.exports=tourModel