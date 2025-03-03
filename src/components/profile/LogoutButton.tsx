
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="mt-8">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        onClick={onLogout}
      >
        <LogOut size={16} />
        <span className="font-medium">Sign Out</span>
      </Button>
    </div>
  );
};

export default LogoutButton;
