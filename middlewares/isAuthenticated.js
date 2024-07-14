const  catchAsyncfn =require("../utils/catchAsyncFn");
const jwt=require('jsonwebtoken')
const AppError=require('../utils/AppError');
const userModel = require("../models/userModel");
const isAuthenticated=catchAsyncfn(async (req, res, next) => {
        // 1) Getting token and check of it's there
        let token;
        if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
        }
        // 2) Verification token
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        console.log(decoded) 
        // 3) Check if user still exists
        const currentUser = await userModel.findById(decoded.id);
        if (!currentUser) {
        return next(
            new AppError(
            'The user belonging to this token does no longer exist.',
            401
            )
        );
        }
    
        // 4) Check if user changed password after the token was generated
        if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }
    
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    });
module.exports=isAuthenticated