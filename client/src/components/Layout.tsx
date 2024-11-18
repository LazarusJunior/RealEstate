import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Home, Building, DollarSign, User, LogOut, Menu, X } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated && (
        <aside className={`bg-primary text-primary-foreground w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-300 ease-in-out`}>
          <div className="p-4">
            <h1 className="text-2xl font-bold">Real Estate Tokenization</h1>
          </div>
          <nav className="mt-8">
            <Link to="/dashboard" className="block py-2 px-4 hover:bg-primary-foreground hover:text-primary transition-colors">
              <Home className="inline-block mr-2" size={18} />
              Dashboard
            </Link>
            <Link to="/properties" className="block py-2 px-4 hover:bg-primary-foreground hover:text-primary transition-colors">
              <Building className="inline-block mr-2" size={18} />
              Properties
            </Link>
            <Link to="/investments" className="block py-2 px-4 hover:bg-primary-foreground hover:text-primary transition-colors">
              <DollarSign className="inline-block mr-2" size={18} />
              Investments
            </Link>
            <Link to="/profile" className="block py-2 px-4 hover:bg-primary-foreground hover:text-primary transition-colors">
              <User className="inline-block mr-2" size={18} />
              Profile
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="block py-2 px-4 hover:bg-primary-foreground hover:text-primary transition-colors">
                <User className="inline-block mr-2" size={18} />
                Admin Dashboard
              </Link>
            )}
          </nav>
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {isAuthenticated && (
              <button onClick={toggleSidebar} className="md:hidden">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">Real Estate Tokenization</h1>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="mr-2" size={18} />
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-primary hover:text-primary-dark">Login</Link>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;