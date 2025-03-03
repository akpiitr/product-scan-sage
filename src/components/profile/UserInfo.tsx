
import React from 'react';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserInfoProps {
  currentUser: User | null;
  onEditProfile: () => void;
  userProfile?: any;
  isLoading?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ 
  currentUser, 
  onEditProfile,
  userProfile,
  isLoading = false
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.name || currentUser?.displayName || 'User';
  const email = userProfile?.email || currentUser?.email || '';
  const initials = getInitials(displayName);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-medium">Personal Information</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEditProfile}
          className="text-xs"
        >
          <Edit2 size={14} className="mr-1" />
          Edit
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={currentUser?.photoURL || undefined} alt={displayName} />
          <AvatarFallback className="text-lg bg-brand-accent text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <h3 className="font-medium">{displayName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {email}
              </p>
            </>
          )}
        </div>
      </div>
      
      {!isLoading && userProfile && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="font-medium">{userProfile.dob}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Age</p>
            <p className="font-medium">{userProfile.age}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
