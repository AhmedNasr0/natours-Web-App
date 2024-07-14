const express = require('express');
const {getReview,setTourUserIds,getAllReviews,updateReview,deleteReview,createReview} = require('../controllers/reviewControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');
const restrictTo=require('../middlewares/restrictedTo')
const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router
  .route('/')
  .get(getAllReviews)
  .post(
    restrictTo('user'),
    setTourUserIds,
    createReview
  );

router
  .route('/:id')
  .get(getReview)
  .patch(
    restrictTo('user', 'admin'),
    updateReview
  )
  .delete(
    restrictTo('user', 'admin'),
    deleteReview
  );

module.exports=router;