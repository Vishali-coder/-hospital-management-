import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'PATIENT':
        return '/patient/dashboard';
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            🏥 Hospital Booking System
          </Link>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-white hover:text-primary-200 transition-colors"
                >
                  Dashboard
                </Link>
                
                {currentUser.role === 'PATIENT' && (
                  <Link 
                    to="/patient/doctors" 
                    className="text-white hover:text-primary-200 transition-colors"
                  >
                    Find Doctors
                  </Link>
                )}
                
                <span className="text-primary-200">
                  Welcome, {currentUser.firstName}
                </span>
                
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-primary-200 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;