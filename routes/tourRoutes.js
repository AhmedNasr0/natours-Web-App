const express = require('express');
const {createTour,updateTour,getDistance,deleteTour , getTour,getAllTours, aliasTourTopCheap,TourStats, MonthlyPlan, getTourWithin, uploadTourImages} = require('./../controllers/tourControllers');
const reviewRouter=require('./reviewRoutes');
const isAuthenticated = require('../middlewares/isAuthenticated');
const restrictedTo = require('../middlewares/restrictedTo');
const resizeTourImages = require('../middlewares/resizeTourPhotos');
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);

router.get('/Top-5-cheap',aliasTourTopCheap,getAllTours)
router.get('/TourStats',TourStats)
router.get('/monthly-plane/:year',isAuthenticated,restrictedTo('admin', 'lead-guide', 'guide'),MonthlyPlan)
router.get('/tours-within/:distance/center/:latlng/unit/:unit',getTourWithin);
router.get('/distance/:latlng/unit/:unit',getDistance)
router
  .route('/')
  .get(getAllTours)
  .post(isAuthenticated,restrictedTo('admin','user', 'lead-guide'),createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(isAuthenticated,restrictedTo('admin','user', 'lead-guide'),uploadTourImages,resizeTourImages,updateTour)
  .delete(isAuthenticated,restrictedTo('admin', 'lead-guide'),deleteTour);

module.exports = router;