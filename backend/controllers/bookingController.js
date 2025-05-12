const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Homeowner
const createBooking = async (req, res) => {
  try {
    const {
      professional,
      service,
      description,
      address,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
    } = req.body;

    // Check if professional exists and is verified
    const professionalUser = await User.findOne({
      _id: professional,
      role: 'professional',
      isVerified: true,
    });

    if (!professionalUser) {
      return res.status(400).json({ message: 'Professional not found or not verified' });
    }

    const booking = await Booking.create({
      homeowner: req.user._id,
      professional,
      service,
      description,
      address: address || req.user.address,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for logged in user (homeowner or professional)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    let bookings;
    
    // Find bookings based on user role
    if (req.user.role === 'homeowner') {
      bookings = await Booking.find({ homeowner: req.user._id })
        .populate('professional', 'name email phone')
        .populate('service', 'name category pricing')
        .sort({ scheduledDate: -1 });
    } else if (req.user.role === 'professional') {
      bookings = await Booking.find({ professional: req.user._id })
        .populate('homeowner', 'name email phone address')
        .populate('service', 'name category pricing')
        .sort({ scheduledDate: -1 });
    } else {
      // Admin can see all bookings
      bookings = await Booking.find({})
        .populate('homeowner', 'name email')
        .populate('professional', 'name email')
        .populate('service', 'name category')
        .sort({ scheduledDate: -1 });
    }
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('homeowner', 'name email phone address')
      .populate('professional', 'name email phone')
      .populate('service', 'name category pricing');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (
      booking.homeowner._id.toString() !== req.user._id.toString() &&
      booking.professional._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    if (
      booking.homeowner.toString() !== req.user._id.toString() &&
      booking.professional.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    // Update booking status
    booking.status = status;
    
    // If marking as completed, set completion date
    if (status === 'completed') {
      booking.completedAt = Date.now();
    }
    
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a quote to a booking
// @route   PUT /api/bookings/:id/quote
// @access  Private/Professional
const addQuoteToBooking = async (req, res) => {
  try {
    const { amount, details, expiresAt } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the professional assigned to this booking
    if (booking.professional.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add quote to this booking' });
    }
    
    // Add quote to booking
    booking.quote = {
      amount,
      details,
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    };
    
    // Update status to quote provided
    booking.status = 'quote_provided';
    
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review to a booking
// @route   PUT /api/bookings/:id/review
// @access  Private/Homeowner
const addReviewToBooking = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the homeowner for this booking
    if (booking.homeowner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }
    
    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review a booking that is not completed' });
    }
    
    // Add review to booking
    booking.review = {
      rating,
      comment,
      date: Date.now(),
    };
    
    // Update professional's average rating
    const professional = await User.findById(booking.professional);
    
    if (professional) {
      const currentRating = professional.professional.rating.average || 0;
      const currentCount = professional.professional.rating.count || 0;
      
      // Calculate new average rating
      const newCount = currentCount + 1;
      const newAverage =