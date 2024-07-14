
const fs=require('fs');
const tourModel = require('../models/tourModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');

const users=JSON.parse(fs.readFileSync(`${__dirname}/user.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));
const importData = async () => {
    try {
    await userModel.create(users,{validateBeforeSave:false});
    await reviewModel.create(reviews) 
    console.log('Data successfully loaded!');
    } catch (err) {
    console.log(err);
    }
    process.exit();
};
module.exports=importData