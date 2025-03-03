
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';

interface UserInfoProps {
  currentUser: User | null;
  onEditProfile: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ currentUser, onEditProfile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-brand-light dark:bg-gray-700 flex items-center justify-center">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-medium text-brand-accent">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="font-medium">
            {currentUser?.displayName || 'User'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentUser?.email || currentUser?.phoneNumber || 'No contact info'}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 rounded-full px-4 py-1 font-medium text-sm text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 sf-pro-text"
          onClick={onEditProfile}
        >
          <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          <span>Edit Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
