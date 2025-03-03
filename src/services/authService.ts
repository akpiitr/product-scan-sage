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

// Keep track of recaptcha instance to avoid duplicate rendering
let recaptchaVerifier: RecaptchaVerifier | null = null;

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
    // Clear previous recaptcha to avoid errors
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    // Clean up any existing recaptcha containers
    const oldContainer = document.getElementById('recaptcha-container');
    if (oldContainer) {
      oldContainer.innerHTML = '';
    }
    
    // Create a fresh recaptcha verifier instance
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    
    // Ensure phone number has proper format
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber}`;
    }
    
    console.log('Sending OTP to:', phoneNumber);
    
    const confirmationResult = await signInWithPhoneNumber(
      auth, 
      phoneNumber, 
      recaptchaVerifier
    );
    
    setVerificationId(confirmationResult.verificationId);
    setPhoneNumber(phoneNumber);
    toast.success(`OTP sent to ${phoneNumber}`);
  } catch (error: any) {
    console.error("Failed to send OTP", error);
    toast.error(error.message || "Failed to send OTP");
    
    // Clean up on error
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
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
    await signInWithPopup(auth, credential as any);
    toast.success("Phone verification successful!");
    
    // Clear the recaptcha after successful verification
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to verify OTP");
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (isInDemoMode) {
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
