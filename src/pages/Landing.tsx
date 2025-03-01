
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Mail, Phone, ArrowRight, Google } from 'lucide-react';
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
    setTimeout(() => navigate('/'), 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock email authentication
    if (email && password) {
      toast.success('Email login successful!');
      setTimeout(() => navigate('/'), 1500);
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
      setTimeout(() => navigate('/'), 1500);
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
                  <Google className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm font-medium"
                  onClick={() => {
                    toast.success('Apple login successful!');
                    setTimeout(() => navigate('/'), 1500);
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
