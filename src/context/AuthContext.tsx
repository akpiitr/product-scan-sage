
import React, { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { AuthContextType } from "../types/auth";
import { 
  emailSignIn, 
  emailSignUp, 
  googleSignIn, 
  sendOtp, 
  verifyOtp, 
  signOutUser 
} from "../services/authService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumberForVerification, setPhoneNumberForVerification] = useState<string | null>(null);
  
  useEffect(() => {
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
      setLoading(false);
    });

    // Initial session check
    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
      setLoading(false);
    };
    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await emailSignIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await emailSignUp(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await googleSignIn();
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async (phoneNumber: string) => {
    setLoading(true);
    try {
      await sendOtp(phoneNumber, setVerificationId, setPhoneNumberForVerification);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (otp: string) => {
    setLoading(true);
    try {
      await verifyOtp(otp, verificationId, phoneNumberForVerification);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await signOutUser();
  };

  const value = {
    currentUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    signOut,
    isDemo: false // No longer in demo mode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
