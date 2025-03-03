
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
import { createMockUser } from "../utils/mockAuth";

export const emailSignIn = async (email: string, password: string): Promise<void> => {
  if (isInDemoMode) {
    toast.success("Demo login successful!");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Successfully signed in!");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
};

export const emailSignUp = async (email: string, password: string): Promise<void> => {
  if (isInDemoMode) {
    toast.success("Demo signup successful!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    toast.success("Account created successfully!");
  } catch (error: any) {
    toast.error(error.message || "Failed to create account");
    throw error;
  }
};

export const googleSignIn = async (): Promise<void> => {
  if (isInDemoMode) {
    toast.success("Demo Google login successful!");
    return;
  }

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
  }
};

export const sendOtp = async (
  phoneNumber: string, 
  setVerificationId: (id: string) => void,
  setPhoneNumber: (phone: string) => void
): Promise<void> => {
  if (isInDemoMode) {
    toast.success(`OTP sent to ${phoneNumber}`);
    setPhoneNumber(phoneNumber);
    return;
  }

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
    setPhoneNumber(phoneNumber);
    toast.success(`OTP sent to ${phoneNumber}`);
  } catch (error: any) {
    toast.error(error.message || "Failed to send OTP");
    throw error;
  }
};

export const verifyOtp = async (
  otp: string,
  verificationId: string | null,
  phoneNumber: string | null
): Promise<void> => {
  if (isInDemoMode) {
    toast.success("Phone verification successful!");
    return;
  }

  if (!verificationId) {
    toast.error("No OTP was sent. Please request an OTP first.");
    return;
  }

  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    await signInWithPhoneNumber(auth, phoneNumber || "", new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    }));
    toast.success("Phone verification successful!");
  } catch (error: any) {
    toast.error(error.message || "Failed to verify OTP");
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (isInDemoMode) {
    toast.success("Signed out successfully!");
    return null;
  }

  try {
    await firebaseSignOut(auth);
    toast.success("Signed out successfully!");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
};
