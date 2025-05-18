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

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'homeowner',
    phone: '555-123-4567',
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
    },
    isVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'professional',
    phone: '555-987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02110',
      country: 'USA',
    },
    isVerified: true,
    professional: {
      skills: ['Plumbing', 'Leak Repair', 'Installation'],
      backgroundCheck: {
        status: 'approved',
        date: new Date(),
      },
      availability: {
        weekdays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '17:00',
      },
      rating: {
        average: 4.8,
        count: 25,
      },
    },
  },
];