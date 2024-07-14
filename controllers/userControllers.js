const userModel = require("../models/userModel");
const catchAsyncfn = require("../utils/catchAsyncFn");
const {getAll,getOne,createOne,updateOne,deleteOne} = require('./controllerFactory');
const multer=require('multer')

exports.getAllUsers =getAll(userModel)
exports.getUser = getOne(userModel)
exports.createUser = createOne(userModel)
exports.updateUser = updateOne(userModel)
exports.deleteUser = deleteOne(userModel)

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe=catchAsyncfn(async(req,res,next)=>{
  console.log(req.file);
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo=req.file.filename
  // 3) Update user document
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
})

exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id 
  next()
}

const multerStorage=multer.memoryStorage();

const upload=multer({
  storage:multerStorage
})

exports.uploadPhoto=upload.single('photo')
