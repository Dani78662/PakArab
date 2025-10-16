const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('https://pakarab.onrender.com/api/auth/login', {
      username: 'care_service',
      password: 'care123',
      role: 'care_service'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
};

testLogin();
