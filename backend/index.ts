import express from 'express';
import mongodb from 'mongodb'
import mongoose from 'mongoose'
import morgan from 'morgan';
const app= express() 
import userRouter from './Routes/userRoutes';
import tourRouter from './Routes/tourRoutes';
import env from 'dotenv';
env.config({path:'./config.env'});



// mongoose.connect('').then(
//     ()=>{
//         console.log('connected successfully')
//     }
// )
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/tours',tourRouter)

app.listen('5000',()=>
    console.log("Server Connected")
)