import express, { Request,Response,NextFunction } from 'express';
import mongodb from 'mongodb'
import mongoose from 'mongoose'
import morgan from 'morgan';
const app= express() 
import userRouter from './Routes/userRoutes';
import tourRouter from './Routes/tourRoutes';
import env from 'dotenv';
import globaleErrorhandler from './Controllers/error.controller'
import AppError from './utils/AppError';
import reviewRouter from './Routes/reviewRoutes'
env.config({path:'./config.env'});



mongoose.connect(`${process.env.DATABASE}`,{autoIndex: true , family: 4}).then(()=>{
    console.log("Database Connecte Successfully")
})

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

console.log(process.env.NODE_ENV);
app.use(express.json())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/tours',tourRouter)
// error handler 
app.all('*', (req:Request,res:Response,next:NextFunction)=>{
    next(new AppError(`this URL (${req.url}) not in this server !`,404)) 
})

// global error handling
app.use(globaleErrorhandler)

app.listen(process.env.PORT||5000,()=>
    console.log(`Server Connected ,Port ${process.env.PORT}`)
)