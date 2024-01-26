const express=require('express')
import {getAllUsers,updateUser,deleteUser,getUser,createUser} from '../Controllers/userControllers'
const router=express.Router();

// router.param('id',);


router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id').get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router