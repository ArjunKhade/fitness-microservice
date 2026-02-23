import React from 'react'
import { useNavigate } from 'react-router'
import { logout } from '../store/appSlice';
import { useDispatch } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Title */}
          <div className="flex items-center">
            <div 
              onClick={() => navigate('/')}
              className="text-white text-2xl font-bold cursor-pointer hover:text-blue-200 transition duration-300"
            >
              💪 FitTrack
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-blue-200 transition duration-300 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/activities')}
              className="text-white hover:text-blue-200 transition duration-300 font-medium"
            >
              Activities
            </button>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
