
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleGoogleLogin = () => {
    // Mock Google authentication
    toast.success('Google login successful!');
    setTimeout(() => navigate('/home'), 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock email authentication
    if (email && password) {
      toast.success('Email login successful!');
      setTimeout(() => navigate('/home'), 1500);
    } else {
      toast.error('Please enter both email and password');
    }
  };

  const handleSendOtp = () => {
    // Mock OTP sending
    if (phoneNumber.length >= 10) {
      toast.success(`OTP sent to ${phoneNumber}`);
      setShowOtpInput(true);
    } else {
      toast.error('Please enter a valid phone number');
    }
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification
    if (otp.length === 6) {
      toast.success('Phone verification successful!');
      setTimeout(() => navigate('/home'), 1500);
    } else {
      toast.error('Please enter a valid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-1">ProductSense</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover the best skincare for you
          </p>
        </div>

        {/* Login Options */}
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <Tabs defaultValue="social" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              {/* Social Login */}
              <TabsContent value="social" className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm font-medium" 
                  onClick={handleGoogleLogin}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" className="mr-2">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm font-medium"
                  onClick={() => {
                    toast.success('Apple login successful!');
                    setTimeout(() => navigate('/home'), 1500);
                  }}
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Continue with Apple
                </Button>
              </TabsContent>

              {/* Email Login */}
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800">
                    Continue with Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* Phone Login */}
              <TabsContent value="phone">
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        className="h-12"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                        onChange={(e) => setOtp(e.target.value)}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Landing;
