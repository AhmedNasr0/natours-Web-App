
import express from 'express'
import { createReview, deleteReview, getAllReviews, forUserHimSelf, updateReview, checkUserTourIDs, getSingleReview } from '../Controllers/reviewController'
import { protectRoute, restrictTo } from '../Controllers/authController';


const router=express.Router({mergeParams:true})

router.use(protectRoute)

router.route('/').get(getAllReviews)
        .post(restrictTo('user') as any,checkUserTourIDs,createReview);

router.route('/:id').get(getSingleReview).patch(restrictTo('admin','user') as any,forUserHimSelf,updateReview).delete(restrictTo('admin','user')as any,forUserHimSelf,deleteReview);


export default router