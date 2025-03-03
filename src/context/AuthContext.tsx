import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier
} from "firebase/auth";
import { auth, googleProvider, isInDemoMode } from "../lib/firebase";
import { toast } from "sonner";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string) => Promise<void>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemo: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumberForVerification, setPhoneNumberForVerification] = useState<string | null>(null);
  
  const mockAuth = () => {
    if (isInDemoMode) {
      setCurrentUser({
        uid: "demo-user-id",
        email: "demo@example.com",
        displayName: "Demo User",
        phoneNumber: "+1234567890",
        emailVerified: true,
        isAnonymous: false,
        photoURL: null,
        providerData: [],
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "demo-token",
        getIdTokenResult: async () => ({
          token: "demo-token",
          signInProvider: "demo",
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          issuedAtTime: new Date().toISOString(),
          claims: {},
          authTime: new Date().toISOString(),
        }),
        reload: async () => {},
        toJSON: () => ({})
      } as User);
    }
  };

  useEffect(() => {
    if (isInDemoMode) {
      mockAuth();
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (isInDemoMode) {
      toast.success("Demo login successful!");
      mockAuth();
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (isInDemoMode) {
      toast.success("Demo signup successful!");
      mockAuth();
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (isInDemoMode) {
      toast.success("Demo Google login successful!");
      mockAuth();
      return;
    }

    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google sign in successful!");
    } catch (error: any) {
      if (error.code === "auth/unauthorized-domain") {
        toast.error(
          "This domain is not authorized in Firebase. Please add it in the Firebase console under Authentication > Sign-in method > Authorized domains."
        );
        console.error("Unauthorized domain. Add this domain to your Firebase project:", window.location.hostname);
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async (phoneNumber: string) => {
    if (isInDemoMode) {
      toast.success(`OTP sent to ${phoneNumber}`);
      setPhoneNumberForVerification(phoneNumber);
      return;
    }

    setLoading(true);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber, 
        recaptchaVerifier
      );
      
      setVerificationId(verificationId);
      setPhoneNumberForVerification(phoneNumber);
      toast.success(`OTP sent to ${phoneNumber}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (otp: string) => {
    if (isInDemoMode) {
      toast.success("Phone verification successful!");
      mockAuth();
      return;
    }

    if (!verificationId) {
      toast.error("No OTP was sent. Please request an OTP first.");
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithPhoneNumber(auth, phoneNumberForVerification || "", new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      }));
      toast.success("Phone verification successful!");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isInDemoMode) {
      setCurrentUser(null);
      toast.success("Signed out successfully!");
      return;
    }

    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
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
    isDemo: isInDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
};
