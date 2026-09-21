// Simple API test utility
import api from './api';

export const testAPI = async () => {
  const tests = [];
  
  try {
    // Test 1: Basic connectivity
    console.log('🧪 Testing API connectivity...');
    const pingResponse = await api.get('/test/ping');
    tests.push({ name: 'Ping Test', status: 'PASS', data: pingResponse.data });
    console.log('✅ Ping test passed');
  } catch (error) {
    tests.push({ name: 'Ping Test', status: 'FAIL', error: error.message });
    console.log('❌ Ping test failed:', error.message);
  }

  try {
    // Test 2: Health check
    console.log('🧪 Testing health endpoint...');
    const healthResponse = await api.get('/test/health');
    tests.push({ name: 'Health Test', status: 'PASS', data: healthResponse.data });
    console.log('✅ Health test passed');
  } catch (error) {
    tests.push({ name: 'Health Test', status: 'FAIL', error: error.message });
    console.log('❌ Health test failed:', error.message);
  }

  try {
    // Test 3: Demo accounts
    console.log('🧪 Testing demo accounts endpoint...');
    const demoResponse = await api.get('/test/demo-accounts');
    tests.push({ name: 'Demo Accounts Test', status: 'PASS', data: demoResponse.data });
    console.log('✅ Demo accounts test passed');
  } catch (error) {
    tests.push({ name: 'Demo Accounts Test', status: 'FAIL', error: error.message });
    console.log('❌ Demo accounts test failed:', error.message);
  }

  try {
    // Test 4: Authentication test
    console.log('🧪 Testing authentication...');
    const authResponse = await api.post('/auth/signin', {
      email: 'patient@demo.com',
      password: 'password123'
    });
    tests.push({ name: 'Authentication Test', status: 'PASS', data: { token: 'received' } });
    console.log('✅ Authentication test passed');
    
    // Store token for further tests
    const token = authResponse.data.accessToken;
    localStorage.setItem('token', token);
    
    try {
      // Test 5: Protected endpoint
      console.log('🧪 Testing protected endpoint...');
      const doctorsResponse = await api.get('/patient/doctors');
      tests.push({ name: 'Protected Endpoint Test', status: 'PASS', data: { count: doctorsResponse.data.length } });
      console.log('✅ Protected endpoint test passed');
    } catch (error) {
      tests.push({ name: 'Protected Endpoint Test', status: 'FAIL', error: error.message });
      console.log('❌ Protected endpoint test failed:', error.message);
    }
    
  } catch (error) {
    tests.push({ name: 'Authentication Test', status: 'FAIL', error: error.message });
    console.log('❌ Authentication test failed:', error.message);
  }

  // Summary
  const passedTests = tests.filter(t => t.status === 'PASS').length;
  const totalTests = tests.length;
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the backend server and MongoDB connection.');
  }
  
  return tests;
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to run tests automatically
  // setTimeout(() => testAPI(), 2000);
}