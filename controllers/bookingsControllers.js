const catchAsyncfn = require("../utils/catchAsyncFn");
const { createOne,getOne,getAll,deleteOne, updateOne } = require("./controllerFactory");
const Booking = require("../models/bookingModel");
require('dotenv').config()
const stripe=require('stripe')(process.env.STRIPE_SECRET)
exports.createPaymentIntent=catchAsyncfn(async(req,res,next)=>{
    const{numberOfBookings}=req.body
    const tour=await Tour.findById(req.params.tourId)
    const totalCost=tour.price*numberOfBookings
    const payment=await stripe.paymentIntents.create({
        amount:totalCost*100,
        currency:'usd',
        metadata:{
            userId:req.user.id.toString(),
            tourId:tour._id.toString(),
            tourName:tour.name
        }
    })
    console.log(payment.client_secret)
    res.status(200).json({
        payment
    })
})
exports.createBooking = catchAsyncfn(async(req,res,next)=>{
    const user=req.user._id
    const {tour,paid,price,numberOfBookings}=req.body 
    const book=await Booking.create({user,paid,price,numberOfBookings,tour})
    res.status(200).json({
        message:'success',
        book
    })
})
exports.getMyBookings=catchAsyncfn(async(req,res,next)=>{
    const bookings=await Booking.find()
    const userId=req.user._id 

    const relatedBookings=bookings.filter(el=>{
        return el.user._id.toString()==userId.toString() 
    })
    res.status(200).json({
        data:relatedBookings
    })
})
exports.updateBooking=updateOne(Booking)
exports.getBooking = getOne(Booking);
exports.getAllBookings =getAll(Booking);
exports.deleteBooking = deleteOne(Booking);
