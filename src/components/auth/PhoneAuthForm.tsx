
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PhoneAuthFormProps {
  sendPhoneOtp: (phoneNumber: string) => Promise<void>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({
  sendPhoneOtp,
  verifyPhoneOtp,
  setAuthError
}) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSendOtp = async () => {
    setAuthError(null);
    if (phoneNumber.length >= 10) {
      try {
        await sendPhoneOtp(phoneNumber);
        setShowOtpInput(true);
      } catch (error: any) {
        console.error("Failed to send OTP", error);
        setAuthError(error.message);
      }
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (otp.length === 6) {
      try {
        await verifyPhoneOtp(otp);
        navigate('/home');
      } catch (error: any) {
        console.error("OTP verification failed", error);
        setAuthError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handlePhoneLogin} className="space-y-4">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="tel"
            placeholder="Phone number"
            className="h-12"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            className="shrink-0"
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </div>
        
        {showOtpInput && (
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="h-12"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            required
          />
        )}
      </div>
      
      {showOtpInput && (
        <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800">
          Verify & Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </form>
  );
};
