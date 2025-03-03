
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useProducts } from '@/context/ProductContext';
import Navigation from '@/components/Navigation';
import SkinProfile from '@/components/SkinProfile';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { skinProfile } = useProducts();
  
  // Profile edit state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    dob: new Date(),
    age: '',
    email: currentUser?.email || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleProfileChange = (field: string, value: string | Date) => {
    // Clear the error for this field
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
    
    if (field === 'dob' && value instanceof Date) {
      // Calculate age automatically
      const today = new Date();
      let age = today.getFullYear() - value.getFullYear();
      const monthDiff = today.getMonth() - value.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
        age--;
      }
      setProfileData(prev => ({...prev, dob: value, age: String(age)}));
    } else {
      setProfileData(prev => ({...prev, [field]: value}));
    }
  };
  
  const validateProfileData = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!profileData.dob) {
      newErrors.dob = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = () => {
    if (validateProfileData()) {
      // Here we would update the user's profile in the backend
      // For now, we'll just close the dialog and show a success message
      setShowEditProfile(false);
      toast.success('Profile updated successfully');
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 rounded-full px-4 py-1 font-medium text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleEditProfileClick}
              >
                <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
          
          {/* Edit Profile Dialog */}
          <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information below
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dob" className="text-right">
                    Date of Birth
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dob"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            errors.dob ? "border-red-500" : "",
                            !profileData.dob && "text-muted-foreground"
                          )}
                        >
                          {profileData.dob ? (
                            format(profileData.dob, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={profileData.dob}
                          onSelect={(date) => date && handleProfileChange('dob', date)}
                          disabled={(date) => 
                            date > new Date() || 
                            date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="age"
                      value={profileData.age}
                      readOnly
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated from date of birth</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
