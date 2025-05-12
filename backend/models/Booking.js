const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    homeowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'quote_requested', 'quote_provided', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    problemImages: [String],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    estimatedDuration: {
      type: Number, // in hours
      default: 1,
    },
    quote: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      details: String,
      expiresAt: Date,
    },
    payment: {
      transactionId: String,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending',
      },
      date: Date,
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      date: Date,
    },
    notes: [
      {
        text: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    warranty: {
      isWarranty: {
        type: Boolean,
        default: false,
      },
      expirationDate: Date,
      description: String,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;