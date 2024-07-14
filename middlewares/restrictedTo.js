const AppError = require("../utils/AppError.js")
const catchAsyncfn = require("../utils/catchAsyncFn.js")


const restrictedTo=(...roles)=>{
    return catchAsyncfn(async(req,res,next)=>{
    if(!roles.includes(req.user.role)) return next(new AppError('You Do not Have Permission TO Perform This Task'),403)
    next()
})}



module.exports=restrictedTo