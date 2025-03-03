
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
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number with international format
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Ensure the number has the +1 country code for US
    if (!phone.includes('+')) {
      return `+1${digitsOnly}`;
    }
    
    return phone;
  };

  const handleSendOtp = async () => {
    if (isLoading) return;
    
    setAuthError(null);
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending OTP to formatted number:', formattedPhone);
      await sendPhoneOtp(formattedPhone);
      setShowOtpInput(true);
    } catch (error: any) {
      console.error("Failed to send OTP", error);
      setAuthError(error.message || "Failed to send OTP. Please check your phone number format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !showOtpInput) return;
    
    setAuthError(null);
    setIsLoading(true);
    
    if (otp.length === 6) {
      try {
        await verifyPhoneOtp(otp);
        navigate('/home');
      } catch (error: any) {
        console.error("OTP verification failed", error);
        setAuthError(error.message || "Failed to verify OTP. Please check the code and try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setAuthError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePhoneLogin} className="space-y-4">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="tel"
            placeholder="Phone number (with country code)"
            className="h-12"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading || showOtpInput}
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            className="shrink-0"
            onClick={handleSendOtp}
            disabled={isLoading || showOtpInput || phoneNumber.length < 10}
          >
            {isLoading ? "Sending..." : "Send OTP"}
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
            disabled={isLoading}
            required
          />
        )}
      </div>
      
      {showOtpInput && (
        <Button 
          type="submit" 
          className="w-full h-12 bg-black hover:bg-gray-800"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </form>
  );
};
