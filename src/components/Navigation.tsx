
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, History, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around h-16 px-6 max-w-md mx-auto">
        <NavLink 
          to="/" 
          className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-brand-accent' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Home size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/scan" 
          className={`flex flex-col items-center justify-center ${isActive('/scan') ? 'text-brand-accent' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Camera size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Scan</span>
        </NavLink>
        
        <NavLink 
          to="/history" 
          className={`flex flex-col items-center justify-center ${isActive('/history') ? 'text-brand-accent' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <History size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">History</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-brand-accent' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <User size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
