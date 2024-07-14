const express = require('express');
const morgan = require('morgan');
const mongoose=require('mongoose')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes')
const dotenv=require('dotenv');
const importData = require('./data/importData');
const AppError = require('./utils/AppError');
const errorHandlers = require('./controllers/errorHandlers');
const limiter=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const bookingRouter=require('./routes/bookingRoutes')
const xss=require('xss-clean')
dotenv.config()
const app = express();
const hpp=require('hpp')
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const express_limiter=limiter({
  max:100,
  windowMs:60*60*1000,
  message:"Too Many Requests , Try Again After One Hour."
})
app.use('/api',express_limiter);
// add more secure options for http
app.use(helmet())
// add mongo sanitization to avoid query from any field (against noSql Query)
app.use(mongoSanitize())
// data sanitization against Xss
app.use(xss())
// prevent parameters Pollutions
app.use(hpp({
  whitelist:[
    'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
  ]
}))

const Tour=require('./models/tourModel')

mongoose.connect(process.env.MONGODB_STRINGCONNECTION).then(
  ()=>{
    console.log("database connected Successfully")
    return Tour.syncIndexes();
})



app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*',(req,res,next)=>{
  next(new AppError(`Can not Find ${req.originalUrl} on this Server !`,400))
})

app.use('*',errorHandlers)
module.exports = app;