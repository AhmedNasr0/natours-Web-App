const catchAsyncfn = require("../utils/catchAsyncFn");
const sharp=require('sharp')

const resizeTourImages = catchAsyncfn(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/tours/${req.body.imageCover}`);
    
    // 2) Images
    req.body.images = [];
    
    await Promise.all(
        req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            
        await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/tours/${filename}`);
        req.body.images.push(filename);
    })
    );

    next();
});
module.exports=resizeTourImages