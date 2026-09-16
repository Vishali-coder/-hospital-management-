import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testAPI } from '../utils/apiTest';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      // Redirect based on role
      switch (user.role) {
        case 'PATIENT':
          navigate('/patient/dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setTesting(true);
    setError('');
    try {
      const results = await testAPI();
      const failedTests = results.filter(t => t.status === 'FAIL');
      if (failedTests.length > 0) {
        setError(`API Tests: ${failedTests.length} failed. Check console for details.`);
      } else {
        setError(''); // Clear any previous errors
        alert('🎉 All API tests passed! The system is working correctly.');
      }
    } catch (error) {
      setError('API test failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login to Your Account
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 mb-3"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={handleTestAPI}
          disabled={testing}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {testing ? 'Testing API...' : '🧪 Test API Connection'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
            Sign up here
          </Link>
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Demo Accounts:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Patient:</strong> patient@demo.com / password123</p>
          <p><strong>Doctor:</strong> doctor@demo.com / password123</p>
          <p><strong>Admin:</strong> admin@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;