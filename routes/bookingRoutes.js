const express = require('express');
const isAuthenticated=require('../middlewares/isAuthenticated');
const { deleteBooking,updateBooking,getBooking,createPaymentIntent, getAllBookings,createBooking, getMyBookings } = require('../controllers/bookingsControllers');
const restrictedTo = require('../middlewares/restrictedTo');
const router = express.Router();
router.use(isAuthenticated);
router.post('/create-payment-intent/:tourId',createPaymentIntent)
// router.use(restrictedTo('admin', 'lead-guide'));
router.get('/myBookings',getMyBookings)
router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports=router 