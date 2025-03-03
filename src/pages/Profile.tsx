
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useProducts } from '@/context/ProductContext';
import Navigation from '@/components/Navigation';
import SkinProfile from '@/components/SkinProfile';
import UserInfo from '@/components/profile/UserInfo';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import LogoutButton from '@/components/profile/LogoutButton';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { skinProfile } = useProducts();
  
  // Profile edit state
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Format current date as MM/DD/YYYY
  const formatCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const initialProfileData = {
    name: currentUser?.displayName || '',
    dob: formatCurrentDate(), // This is now a string in MM/DD/YYYY format
    age: '',
    email: currentUser?.email || ''
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEditProfileClick = () => {
    setShowEditProfile(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <header className="pt-10 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </header>
        
        {/* Main Content */}
        <main className="space-y-8">
          {/* User Info */}
          <UserInfo 
            currentUser={currentUser} 
            onEditProfile={handleEditProfileClick} 
          />
          
          {/* Edit Profile Dialog */}
          <EditProfileDialog 
            open={showEditProfile}
            onOpenChange={setShowEditProfile}
            initialProfileData={initialProfileData}
            currentUserEmail={currentUser?.email}
            currentUserName={currentUser?.displayName}
          />
          
          {/* Skin Profile Section */}
          <SkinProfile />
          
          {/* Logout Button */}
          <LogoutButton onLogout={handleLogout} />
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
