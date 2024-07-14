const { default: mongoose } = require("mongoose");
const tourModel = require("./tourModel");

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review Required']
    },
    ratting:{
        type:Number,
        default:1,
        min:1,
        max:5
    },
    tour:{
        type:mongoose.Types.ObjectId,
        ref:'Tour',
        required:[true,'Review Must belong To Tour']
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true,'Review Must belong To User']
    }

},{timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name'
    }).populate({
        path:'user',
        select:'name photo'
    })
    next()
})


reviewSchema.statics.calcAverageRatings=async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRatings:{$sum:1},
                avgRatings:{$avg:'$ratting'}
            }
        }
    ])
    if (stats.length > 0) {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRatings 
        });
    } else {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
}

reviewSchema.post('save',function(next){
    this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const reviewModel=mongoose.model('Review',reviewSchema);
module.exports=reviewModel