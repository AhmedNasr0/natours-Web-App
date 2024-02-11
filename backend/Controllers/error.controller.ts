import {Request,Response ,NextFunction } from "express";
import AppError from "../utils/AppError";


const handleCastError=(err:any)=>{
    let message= `Invalid ${err.path} : ${err.value}`
    return new AppError(message,400)
}
const handleDublicateField=(err:any)=>{
    let errors=Object.values(err.errors).map((el:any) => el.message)
    let message=`the ${err.keyValue['name']} already found`
    return new AppError(message,400);
}

const handleValidationsError=(err:any)=>{
    let errors=Object.values(err.errors).map((el:any) => el.message)

    let message=`Invalid Input Data ,${errors.join(' ')}`
    return new AppError(message,400)
}
const  handlejwtError=(err:any)=>{return new AppError('Invalid Token, please login Again',401)}

const globalErrorhandler=(err:AppError,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error'

    if(process.env.NODE_ENV=='development'){
        res.status(err.statusCode).json({
            status: `${err.status}`,
            error:err,
            message:`${err.message}`,
            stack:err.stack
        })
    }
    else if(process.env.NODE_ENV==='production'){ 
        let error:any={...err}
        if(err.name=="CastError") error=handleCastError(error);
        if((error.code)==11000) error=handleDublicateField(error);
        if(err.name=='ValidationError') error=handleValidationsError(error);
        if(err.name=='JsonWebTokenError') error=handlejwtError(error);
        // console.log(err)
        if(error.isOperational){
            // Operational Error
            res.status(error.statusCode).json({
                status: `${error.status}`,
                message:`${error.message}`
            })
        }
        else{
            // programming error
            console.error("error : ",error)
            res.status(500).json({
                status:'error',
                message:'something went wrong'
            })
        }
        
    }
}
export default globalErrorhandler