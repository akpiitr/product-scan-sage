
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkinProfile from '@/components/SkinProfile';
import Navigation from '@/components/Navigation';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'skin'>('account');
  
  // Mock account data - in a real app, this would come from your auth/user context
  const [accountData, setAccountData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: '28',
    gender: 'Female',
    password: '••••••••',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPassword = () => {
    // In a real app, this would trigger a password reset flow
    alert('Password reset link sent to your email!');
  };

  const handleSaveAccount = () => {
    // In a real app, this would save account details to your backend
    alert('Account details saved successfully!');
  };
  
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
          <h1 className="text-xl font-medium">Your Profile</h1>
        </header>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center justify-center gap-2 flex-1 py-3 font-medium text-sm transition-colors
              ${activeTab === 'account' 
                ? 'text-brand-accent border-b-2 border-brand-accent' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            <User size={16} />
            Account
          </button>
          <button
            onClick={() => setActiveTab('skin')}
            className={`flex items-center justify-center gap-2 flex-1 py-3 font-medium text-sm transition-colors
              ${activeTab === 'skin' 
                ? 'text-brand-accent border-b-2 border-brand-accent' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            <Shield size={16} />
            Skin Profile
          </button>
        </div>
        
        {/* Main Content */}
        <main className="p-4">
          {activeTab === 'account' ? (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium mb-4">Account Details</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Manage your personal information and account settings.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={accountData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={accountData.email}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Age
                    </label>
                    <Input 
                      id="age"
                      name="age"
                      type="number"
                      value={accountData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={accountData.gender}
                      onChange={(e) => setAccountData(prev => ({ ...prev, gender: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    value={accountData.password}
                    onChange={handleInputChange}
                    disabled
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleResetPassword}
                    variant="outline" 
                    size="sm"
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleSaveAccount}
                  className="w-full bg-brand-accent text-white font-medium py-3 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Save Account Details
                </Button>
              </div>
            </div>
          ) : (
            <SkinProfile />
          )}
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
