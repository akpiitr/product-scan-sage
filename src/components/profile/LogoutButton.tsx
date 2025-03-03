
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
        className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
        onClick={onLogout}
      >
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
