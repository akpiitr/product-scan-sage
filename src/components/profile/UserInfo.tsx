
import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';

interface UserInfoProps {
  currentUser: User | null;
  onEditProfile: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ currentUser, onEditProfile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentUser?.displayName || 'User'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {currentUser?.email || currentUser?.phoneNumber || 'No contact info'}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={onEditProfile}
        >
          <Pencil size={14} className="text-gray-500 dark:text-gray-400" />
          <span>Edit Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
