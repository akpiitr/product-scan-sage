
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { DemoBanner } from '@/components/auth/DemoBanner';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';
import { AuthError } from '@/components/auth/AuthError';

const Landing = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { 
    currentUser, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    sendPhoneOtp, 
    verifyPhoneOtp,
    isDemo
  } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

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

        <DemoBanner isDemo={isDemo} />
        <AuthError error={authError} />

        {/* Login Options */}
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              {/* Email Login Tab */}
              <TabsContent value="email" className="space-y-4">
                <EmailAuthForm 
                  signInWithEmail={signInWithEmail}
                  signUpWithEmail={signUpWithEmail}
                  signInWithGoogle={signInWithGoogle}
                  isDemo={isDemo}
                  setAuthError={setAuthError}
                />
              </TabsContent>

              {/* Phone Login Tab */}
              <TabsContent value="phone">
                <PhoneAuthForm 
                  sendPhoneOtp={sendPhoneOtp}
                  verifyPhoneOtp={verifyPhoneOtp}
                  setAuthError={setAuthError}
                />
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
