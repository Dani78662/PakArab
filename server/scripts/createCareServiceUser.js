const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config.env') });

const createCareServiceUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if care service user already exists
    const existingUser = await User.findOne({ username: 'care_service' });
    if (existingUser) {
      console.log('Care service user already exists');
      return;
    }

    // Create care service user
    const careServiceUser = new User({
      username: 'care_service',
      password: 'care123', // Default password
      role: 'care_service'
    });

    await careServiceUser.save();
    console.log('Care service user created successfully!');
    console.log('Username: care_service');
    console.log('Password: care123');
    console.log('Role: care_service');

  } catch (error) {
    console.error('Error creating care service user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createCareServiceUser();
