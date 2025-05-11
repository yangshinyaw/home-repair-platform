const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'plumbing',
        'electrical',
        'carpentry',
        'painting',
        'appliance',
        'roofing',
        'hvac',
        'cleaning',
        'landscaping',
        'other'
      ],
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: 'hour', // hour, job, square foot, etc.
      },
    },
    estimatedDuration: {
      type: Number, // in hours
      default: 1,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;