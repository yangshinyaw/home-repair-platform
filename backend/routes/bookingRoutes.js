const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  addQuoteToBooking,
  addReviewToBooking,
  addNoteToBooking,
  uploadProblemImages,
} = require('../controllers/bookingController');
const { auth, homeownerOnly, professionalOnly } = require('../middleware/auth');

// Protected routes
router.post('/', auth, homeownerOnly, createBooking);
router.get('/', auth, getMyBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/status', auth, updateBookingStatus);
router.put('/:id/quote', auth, professionalOnly, addQuoteToBooking);
router.put('/:id/review', auth, homeownerOnly, addReviewToBooking);
router.post('/:id/notes', auth, addNoteToBooking);
router.post('/:id/images', auth, homeownerOnly, uploadProblemImages);

module.exports = router;