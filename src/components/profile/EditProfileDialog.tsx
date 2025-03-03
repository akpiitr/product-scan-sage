
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { saveUserProfile } from '@/services/databaseService';

interface ProfileData {
  name: string;
  dob: string;
  age: string;
  email: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfileData: ProfileData;
  currentUserEmail: string | null | undefined;
  currentUserName: string | null | undefined;
  userId: string | null | undefined;
  onProfileSaved?: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  initialProfileData,
  currentUserEmail,
  currentUserName,
  userId,
  onProfileSaved
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    ...initialProfileData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date object to MM/DD/YYYY string
  function formatDateToString(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  // Parse MM/DD/YYYY string to Date object
  function parseDateString(dateString: string): Date | null {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[0], 10) - 1; // Months are 0-indexed in JS Date
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    
    const date = new Date(year, month, day);
    
    // Validate date (handles invalid dates like 02/31/2023)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    
    return date;
  }
  
  // Calculate age from date of birth
  function calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateDob = (dobString: string): boolean => {
    const dobDate = parseDateString(dobString);
    if (!dobDate) return false;
    
    // Validate date range (e.g., not in the future, not too far in the past)
    const today = new Date();
    const pastDate = new Date('1900-01-01');
    
    return dobDate <= today && dobDate >= pastDate;
  };
  
  const handleProfileChange = (field: string, value: string) => {
    // Clear the error for this field
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
    
    if (field === 'dob') {
      // Update DOB and calculate age if valid date format
      setProfileData(prev => ({...prev, dob: value}));
      
      // Try to parse the date and calculate age
      const dobDate = parseDateString(value);
      if (dobDate) {
        const age = calculateAge(dobDate);
        setProfileData(prev => ({...prev, dob: value, age: String(age)}));
      }
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
    
    if (!profileData.dob.trim()) {
      newErrors.dob = 'Date of birth is required';
    } else if (!validateDob(profileData.dob)) {
      newErrors.dob = 'Please enter a valid date in MM/DD/YYYY format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = async () => {
    if (validateProfileData() && userId) {
      try {
        setIsSubmitting(true);
        
        // Save the profile data to Firestore
        await saveUserProfile(userId, {
          name: profileData.name,
          dob: profileData.dob,
          age: profileData.age,
          email: profileData.email,
          createdAt: new Date().toISOString()
        });
        
        onOpenChange(false);
        toast.success('Profile updated successfully');
        
        // Call the callback if provided
        if (onProfileSaved) {
          onProfileSaved();
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <Input
                id="dob"
                placeholder="MM/DD/YYYY"
                value={profileData.dob}
                onChange={(e) => handleProfileChange('dob', e.target.value)}
                className={errors.dob ? "border-red-500" : ""}
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Enter date in MM/DD/YYYY format</p>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
