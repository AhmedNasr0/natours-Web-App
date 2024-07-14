const catchAsyncfn = require("../utils/catchAsyncFn")
const sharp=require('sharp')
const resizeUserPhoto=type=>catchAsyncfn(async(req,res,next)=>{
    if(!req.file) next()
    const uniqueSuffix=Date.now() + '-' + Math.round(Math.random() * 1E9)+'.jpeg'
    req.file.filename= `${req.user.id+ '-' + uniqueSuffix}`
    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`images/users/${req.file.filename}`)
    next() 
})

module.exports=resizeUserPhoto