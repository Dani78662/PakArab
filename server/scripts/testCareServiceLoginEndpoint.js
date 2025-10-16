const axios = require('axios');

const testCareServiceLogin = async () => {
  try {
    console.log('Testing care service login endpoint...');
    
    const response = await axios.post('https://pakarab.onrender.com/api/auth/care-service-login', {
      username: 'care_service',
      password: 'care123'
    });
    
    console.log('✅ Care service login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Care service login failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
};

testCareServiceLogin();
