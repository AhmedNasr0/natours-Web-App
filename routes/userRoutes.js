const express = require('express');
const userController = require('./../controllers/userControllers');
const { signUp, login, forgetPassword, resetPassword, updatePassword } = require('../controllers/authControllers');
const isAuthenticated=require('../middlewares/isAuthenticated');
const resizeUserPhoto = require('../middlewares/resizeUserPhoto');
const router = express.Router();

router.post('/signup',signUp);
router.post('/login',login);
router.post('/forget-password',forgetPassword);
router.patch('/reset-password/:resetToken',resetPassword);

router.use(isAuthenticated);

router.patch('/update-password',updatePassword);
router.patch('/update-me',userController.uploadPhoto,resizeUserPhoto,userController.updateMe)
router.get('/me',userController.getMe,userController.getUser)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;