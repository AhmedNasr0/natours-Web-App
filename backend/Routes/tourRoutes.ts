const express=require('express')
import {getAllTour,getTour,deleteTour,updateTour,createTour} from '../Controllers/tourControllers'
const router=express.Router()

router.route('/')
    .get(getAllTour)
    .post(createTour)


router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)



export default router 