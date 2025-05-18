const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const services = [
  {
    name: 'Plumbing Repair',
    description: 'Fix leaks, clogs, and other plumbing issues',
    category: 'plumbing',
    pricing: {
      basePrice: 85,
      unit: 'hour',
    },
    estimatedDuration: 2,
    icon: 'wrench',
  },
  {
    name: 'Electrical Wiring',
    description: 'Install or repair electrical wiring and fixtures',
    category: 'electrical',
    pricing: {
      basePrice: 95,
      unit: 'hour',
    },
    estimatedDuration: 3,
    icon: 'bolt',
  },
  {
    name: 'Painting Services',
    description: 'Interior and exterior painting services',
    category: 'painting',
    pricing: {
      basePrice: 45,
      unit: 'hour',
    },
    estimatedDuration: 8,
    icon: 'paint-roller',
  },
  {
    name: 'HVAC Repair',
    description: 'Heating, ventilation, and air conditioning repairs',
    category: 'hvac',
    pricing: {
      basePrice: 120,
      unit: 'hour',
    },
    estimatedDuration: 4,
    icon: 'temperature-high',
  },
];