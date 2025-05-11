const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['homeowner', 'professional', 'admin'],
      default: 'homeowner',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Additional fields for professionals
    professional: {
      services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      }],
      skills: [String],
      backgroundCheck: {
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        date: Date,
        documentUrls: [String],
      },
      availability: {
        weekdays: {
          type: [Number],
          default: [1, 2, 3, 4, 5], // Monday to Friday (0 is Sunday, 6 is Saturday)
        },
        startTime: {
          type: String,
          default: '09:00',
        },
        endTime: {
          type: String,
          default: '17:00',
        },
      },
      rating: {
        average: {
          type: Number,
          default: 0,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
