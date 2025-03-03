
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

interface ProfileData {
  name: string;
  dob: Date;
  age: string;
  email: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfileData: ProfileData;
  currentUserEmail: string | null | undefined;
  currentUserName: string | null | undefined;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  initialProfileData,
  currentUserEmail,
  currentUserName
}) => {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Ensure profileData.dob is a valid Date object
  useEffect(() => {
    if (!(profileData.dob instanceof Date) || isNaN(profileData.dob.getTime())) {
      setProfileData(prev => ({...prev, dob: new Date()}));
    }
  }, [profileData.dob]);
  
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
      onOpenChange(false);
      toast.success('Profile updated successfully');
    }
  };

  // Calculate date limits
  const pastDate = new Date('1900-01-01');
  const today = new Date();
  
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
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                    {profileData.dob instanceof Date && !isNaN(profileData.dob.getTime()) ? (
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
                    onSelect={(date) => {
                      if (date) {
                        handleProfileChange('dob', date);
                        setCalendarOpen(false);
                      }
                    }}
                    disabled={(date) => 
                      date > today || 
                      date < pastDate
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
