const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://pakarab.onrender.com',
  'https://pakarab-1.onrender.com'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/data/service', require('./routes/service'));
app.use('/api/data/salesdata', require('./routes/salesdata'));
app.use('/api/data/clientdata', require('./routes/clientdata'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Stack Server is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/mern_project';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('Environment:', process.env.NODE_ENV || 'development');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
