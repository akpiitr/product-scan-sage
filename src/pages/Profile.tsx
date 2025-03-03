
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useProducts } from '@/context/ProductContext';
import Navigation from '@/components/Navigation';
import SkinProfile from '@/components/SkinProfile';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { skinProfile } = useProducts();
  const [showSettings, setShowSettings] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    toast.success("Settings panel toggled");
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
              
              <Button variant="outline" size="icon" onClick={handleSettingsClick}>
                <Settings size={18} />
              </Button>
            </div>
          </div>
          
          {/* Settings Panel (conditionally rendered) */}
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Account Settings</h3>
                  <Button variant="outline" className="w-full justify-start text-left">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Skin Profile Section */}
          <SkinProfile />
          
          {/* Logout Button */}
          <div className="mt-8">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
