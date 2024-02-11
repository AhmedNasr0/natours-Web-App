const express=require('express')
import { forgetPassword, login, protectRoute, resetPassword, restrictTo, signup, updatePassword } from '../Controllers/authController';
import {getAllUsers,updateMe,deleteUser,getUser,getMe, deleteMe, updateUser} from '../Controllers/userControllers'
const router=express.Router();


router.route('/signup').post(signup)

router.route('/login').post(login)

router.route('/forget-password').post(forgetPassword)

router.route('/reset-password/:token').patch(resetPassword)


router.route('/update-password').patch(protectRoute,updatePassword);




router.use(protectRoute); // it mean all routes after this middleware should be protected *

router.route('/me').get(getMe,getUser)

router.route('/update-me').patch(updateMe)

router.route('/delete-me').delete(deleteMe)

router.use(restrictTo('admin')); // routes only for admins

router.route('/')
    .get(getAllUsers)

router.route('/:id').get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router