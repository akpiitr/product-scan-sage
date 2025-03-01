
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkinProfile from '@/components/SkinProfile';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium">Your Skin Profile</h1>
        </header>
        
        {/* Main Content */}
        <main className="p-4">
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Help us understand your skin to provide more personalized product analysis.
          </p>
          
          <SkinProfile />
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
