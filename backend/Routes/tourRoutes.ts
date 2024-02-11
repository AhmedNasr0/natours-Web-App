const express=require('express')
import { protectRoute, restrictTo } from '../Controllers/authController';
import {getAllTour,getTour,deleteTour,updateTour,createTour, getTop5Cheap, getTourStats, monthlyPlane, getTourWithin, getDistance} from '../Controllers/tourControllers'
import reviewRouter from './reviewRoutes';
const router=express.Router()

router.route('/')
    .get(getAllTour)
    .post(protectRoute,restrictTo('admin','lead-guide'),createTour)

router.route('/Top-5-cheap').get(getTop5Cheap,getAllTour);

router.route('/TourStats').get(getTourStats)
router.route('/Monthly-plane/:year').get(protectRoute,restrictTo('admin','guide','lead-guide'),monthlyPlane);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getTourWithin)
router.route('/distance/:latlng/unit/:unit').get(getDistance)

router.route('/:id')
    .get(getTour)
    .patch(protectRoute,restrictTo('admin','lead-guide'),updateTour) // change partial data ----- PUT=> change old full data with new full data
    .delete(protectRoute,restrictTo('admin','lead-guide'),deleteTour)
    
router.use('/:tourId/reviews',reviewRouter)


export default router 