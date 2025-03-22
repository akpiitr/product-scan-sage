
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useProducts } from '@/context/ProductContext';
import Navigation from '@/components/Navigation';
import SkinProfile from '@/components/SkinProfile';
import UserInfo from '@/components/profile/UserInfo';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import LogoutButton from '@/components/profile/LogoutButton';
import { getUserProfile } from '@/services/databaseService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { skinProfile } = useProducts();
  
  // Profile edit state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Format current date as MM/DD/YYYY
  const formatCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser?.id) {
        try {
          const profileData = await getUserProfile(currentUser.id);
          setUserProfile(profileData);
          
          // Check if this is a first-time user (no profile exists)
          if (!profileData) {
            setIsFirstTimeUser(true);
            // Auto-open the profile dialog for first-time users
            setShowEditProfile(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);
  
  const initialProfileData = {
    name: userProfile?.name || currentUser?.user_metadata?.name || '',
    dob: userProfile?.dob || formatCurrentDate(), // This is now a string in MM/DD/YYYY format
    age: userProfile?.age || '',
    email: userProfile?.email || currentUser?.email || ''
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
  
  const handleProfileSaved = async () => {
    // Refetch the profile data after saving
    if (currentUser?.id) {
      try {
        const profileData = await getUserProfile(currentUser.id);
        setUserProfile(profileData);
        setIsFirstTimeUser(false);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
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
          {/* First-time user alert */}
          {isFirstTimeUser && !showEditProfile && (
            <Alert variant="default" className="bg-brand-light border-brand-accent">
              <AlertCircle className="h-4 w-4 text-brand-accent mr-2" />
              <AlertDescription>
                Please complete your profile to get the most out of ProductSense.
                <div className="mt-2">
                  <button
                    onClick={handleEditProfileClick}
                    className="text-brand-accent font-medium hover:underline"
                  >
                    Complete Profile
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* User Info */}
          <UserInfo 
            currentUser={currentUser} 
            onEditProfile={handleEditProfileClick} 
            userProfile={userProfile}
            isLoading={isLoading}
          />
          
          {/* Edit Profile Dialog */}
          <EditProfileDialog 
            open={showEditProfile}
            onOpenChange={setShowEditProfile}
            initialProfileData={initialProfileData}
            currentUserEmail={currentUser?.email}
            currentUserName={currentUser?.user_metadata?.name}
            userId={currentUser?.id}
            onProfileSaved={handleProfileSaved}
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
