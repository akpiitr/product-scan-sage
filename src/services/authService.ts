
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { createMockUser } from "../utils/mockAuth";

export const emailSignIn = async (email: string, password: string): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success("Demo login successful!");
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;
    toast.success("Successfully signed in!");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
};

export const emailSignUp = async (email: string, password: string): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success("Demo signup successful!");
    return;
  }

  try {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`
      }
    });
    
    if (error) throw error;
    toast.success("Check your email to confirm your account!");
  } catch (error: any) {
    toast.error(error.message || "Failed to create account");
    throw error;
  }
};

export const googleSignIn = async (): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success("Demo Google login successful!");
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
    
    if (error) throw error;
    // Success message will be shown after redirect
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in with Google");
    throw error;
  }
};

export const sendOtp = async (
  phoneNumber: string, 
  setVerificationId: (id: string) => void,
  setPhoneNumber: (phone: string) => void
): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success(`OTP sent to ${phoneNumber}`);
    setPhoneNumber(phoneNumber);
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    
    if (error) throw error;
    
    setPhoneNumber(phoneNumber);
    toast.success(`OTP sent to ${phoneNumber}`);
    // Supabase doesn't use verification IDs like Firebase, but we'll set a dummy value
    setVerificationId('supabase-otp');
  } catch (error: any) {
    console.error("Failed to send OTP", error);
    toast.error(error.message || "Failed to send OTP");
    throw error;
  }
};

export const verifyOtp = async (
  otp: string,
  verificationId: string | null,
  phoneNumber: string | null
): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success("Phone verification successful!");
    return;
  }

  if (!phoneNumber) {
    toast.error("No phone number provided. Please request an OTP first.");
    return;
  }

  try {
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms'
    });
    
    if (error) throw error;
    
    toast.success("Phone verification successful!");
  } catch (error: any) {
    toast.error(error.message || "Failed to verify OTP");
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (false) { // Removed demo mode
    toast.success("Signed out successfully!");
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success("Signed out successfully!");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
};
