const userModel = require('../models/userModel.js');
const catchAsyncfn=require('../utils/catchAsyncFn.js')
const AppError=require('../utils/AppError.js')
const jwt=require('jsonwebtoken');
const sendEmail = require('../utils/email.js');
const crypto=require('crypto')


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d'
  });
};



exports.signUp=catchAsyncfn(async (req,res,next)=>{
    const newUser=await userModel.create(req.body);
    const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET,{ expiresIn:'90d'})
    res.status(200).json({
      status:"success",
      token,
      data:{
        newUser
      }
    })
})
exports.login=catchAsyncfn(async(req,res,next)=>{
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
})

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output for secure
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.forgetPassword=catchAsyncfn(async (req,res,next)=>{
  const email=req.body.email 
  if(!email) next(new AppError("Please Provide your Email",400))
  const user=await userModel.findOne({email});
  if(!user) next(new AppError("There is No User WIth THis Email Address",400))
  const resetToken=await user.createPasswordResetToken()
  await user.save({validateBeforeSave:false})
  // sending email
  const resultUrl=`${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`

  const message=`Forget Your Password ? Submit Your New Password and Confirm It Now to ${resultUrl} \n If you didnt forget password Please Avoid This Email`
  
  try{
      await sendEmail({
      email:user.email,
      subject:'Your Password Reset Token VAlid FOr Only 10 Minutes',
      message,
    })
    res.status(200).json({
      status:'success',
      message:'Token Send To email'
    })
  }
  catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpire=undefined;
    await user.save({validateBeforeSave:false})
    next(new AppError('There Are an Error While Sending Email',400))
  }
})

exports.resetPassword=catchAsyncfn(async(req,res,next)=>{
    const hashedToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    console.log(hashedToken)
    const user=await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() }
    })
    console.log(user)
    if(!user){
      next(new AppError("There is No User Or Token Expire",400))
    }
    user.password=req.body.password
    user.confirmPassword=req.body.confirmPassword 
    user.passwordResetToken=undefined
    user.passwordResetExpire=undefined
    console.log(user)
    await user.save()
    createSendToken(user,200,res);
})

exports.updatePassword = catchAsyncfn(async (req, res, next) => {
  
  if(!req.body.currentPassword) next(new AppError("Please Enter Current Password",400))
  if(!req.body.newPassword) next(new AppError("Please Enter new Password",400))
  if(!req.body.newConfirmPassword) next(new AppError("Please Enter new Confirm Password",400))

  // 1) Get user from collection
  const user = await userModel.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newConfirmPassword;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});