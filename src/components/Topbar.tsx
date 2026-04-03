import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Bell, User, LogOut } from 'lucide-react';

const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const pageTitle = location.pathname.split('/')[1] || 'Home';
  const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
  
  const userInitial = user?.email ? user.email[0].toUpperCase() : '?';
  const userName = user?.email || user?.user_metadata?.full_name || 'User';

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 truncate">{title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="animate-pulse bg-gray-200 w-8 h-8 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 truncate">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
        
        {/* Profile */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          title="Logout"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
            {userInitial}
          </div>
          <span className="text-sm font-medium text-gray-900 hidden md:block max-w-[150px] truncate">
            {userName}
          </span>
        </button>
        
        {/* Logout icon integrated in profile */}
        <div className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout} title="Logout">
          <LogOut className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;

