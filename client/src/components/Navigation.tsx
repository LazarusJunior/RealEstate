import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, BuildingOfficeIcon, CurrencyDollarIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
            <HomeIcon className="h-6 w-6 mr-2" />
            Real Estate Tokenization
          </Link>
          <div className="space-x-4">
            <Link to="/properties" className="text-gray-600 hover:text-blue-600 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-1" />
              Properties
            </Link>
            <Link to="/investments" className="text-gray-600 hover:text-blue-600 flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-1" />
              Investments
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 flex items-center">
              <UserIcon className="h-5 w-5 mr-1" />
              Profile
            </Link>
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-1" />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;