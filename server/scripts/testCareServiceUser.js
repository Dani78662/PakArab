const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config.env') });

const testCareServiceUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if care service user exists
    const careServiceUser = await User.findOne({ username: 'care_service', role: 'care_service' });
    
    if (!careServiceUser) {
      console.log('❌ Care service user not found!');
      
      // List all users
      const allUsers = await User.find({});
      console.log('All users in database:');
      allUsers.forEach(user => {
        console.log(`- Username: ${user.username}, Role: ${user.role}`);
      });
      
      return;
    }

    console.log('✅ Care service user found:');
    console.log('- Username:', careServiceUser.username);
    console.log('- Role:', careServiceUser.role);
    console.log('- Created:', careServiceUser.createdAt);

    // Test password comparison
    const passwordMatch = await careServiceUser.comparePassword('care123');
    console.log('- Password match:', passwordMatch);

    if (passwordMatch) {
      console.log('✅ Care service user is ready for login!');
    } else {
      console.log('❌ Password does not match');
    }

  } catch (error) {
    console.error('Error testing care service user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testCareServiceUser();
