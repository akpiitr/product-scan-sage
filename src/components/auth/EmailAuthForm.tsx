
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailAuthFormProps {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isDemo: boolean;
  setAuthError: (error: string | null) => void;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  isDemo,
  setAuthError
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error: any) {
      console.error("Google sign in failed", error);
      // Error will be handled by the toast in AuthContext
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/home');
    } catch (error: any) {
      console.error("Email authentication failed", error);
      setAuthError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Social Login Options */}
      <div className="space-y-3 mb-4">
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
            if (isDemo) {
              signInWithGoogle();
              navigate('/home');
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M16.95 8.207C16.5125 8.207 16.0875 8.314 15.7125 8.467C15.45 8.585 15.1875 8.755 14.9625 8.967C14.7375 9.17767 14.5478 9.426 14.4 9.69767C14.235 10.0217 14.145 10.372 14.1375 10.7307C14.13 11.159 14.2275 11.568 14.4 11.929C14.535 12.2327 14.7225 12.5067 14.9625 12.7403C15.18 12.9523 15.4425 13.1303 15.7275 13.2547C16.11 13.4213 16.53 13.515 16.95 13.515C17.385 13.515 17.7975 13.413 18.165 13.254C18.45 13.1303 18.7125 12.9523 18.9375 12.7403C19.17 12.5067 19.3575 12.2327 19.5 11.929C19.6725 11.568 19.77 11.159 19.7625 10.7307C19.755 10.372 19.665 10.0217 19.5 9.69767C19.3522 9.426 19.1625 9.17767 18.9375 8.967C18.7125 8.755 18.45 8.585 18.1875 8.467C17.8125 8.314 17.3875 8.207 16.95 8.207ZM21.05 7.6C21.6997 7.6 22.3226 7.85286 22.7758 8.30294C23.2291 8.75303 23.485 9.37652 23.4875 10.026V11.982C23.485 12.6308 23.23 13.254 22.7775 13.704C22.3249 14.1539 21.7033 14.4075 21.0538 14.41H17.9175C17.5875 15.0072 17.112 15.5299 16.5275 15.929C15.8915 16.359 15.15 16.602 14.38 16.626H9.62V7.984H14.38C15.15 8.008 15.8915 8.251 16.5275 8.681C17.112 9.08005 17.5875 9.60281 17.9175 10.2H21.05V7.6ZM11.9 16.626H8.36V7.984H11.9V16.626ZM22.325 4.408C22.325 4.408 20.9775 4.26 18.88 4.26C15.4 4.26 11.9 4.773 8.36 4.773C6.87 4.773 5.0125 4.408 5.0125 4.408C4.6825 4.354 4.35778 4.23913 4.0725 4.06856C3.78722 3.89799 3.5483 3.67566 3.37 3.41C3.18392 3.12784 3.07384 2.80422 3.05 2.469C3.01549 2.07017 3.02146 1.66934 3.0275 1.2685C3.03125 1.043 3.035 0.8175 3.035 0.592C3.035 0.5005 3.035 0.4165 3.035 0.333C3.035 0.241 3.035 0.157 3.03125 0.08L3.025 0H5.99625C5.99625 0.0185 5.995 0.0445 5.99375 0.0705L5.9925 0.111L5.99125 0.152C5.99 0.193 5.98875 0.2415 5.9875 0.2825C5.9825 0.4055 5.9775 0.5285 5.97625 0.667C5.97125 0.9935 5.97125 1.32 5.98 1.647C6.00321 1.82273 6.06793 1.99104 6.16912 2.13785C6.27031 2.28466 6.40504 2.40593 6.5625 2.49C6.95 2.683 7.66 2.827 8.36 2.827C8.36 2.827 11.71 2.288 14.38 2.288C17.05 2.288 20.4 2.827 20.4 2.827C21.1 2.827 21.81 2.683 22.1975 2.49C22.355 2.40593 22.4897 2.28466 22.5909 2.13785C22.6921 1.99104 22.7568 1.82273 22.78 1.647C22.7888 1.32 22.7888 0.9935 22.7837 0.667C22.7825 0.5285 22.7775 0.4055 22.7725 0.2825C22.7712 0.2415 22.77 0.193 22.7688 0.152L22.7675 0.111L22.7663 0.0705C22.765 0.0445 22.7637 0.0185 22.7637 0H25.735L25.7275 0.08C25.7237 0.157 25.7237 0.241 25.7237 0.333C25.7237 0.4165 25.7237 0.5005 25.7237 0.592C25.7237 0.8175 25.7275 1.043 25.7312 1.2685C25.7375 1.66934 25.7437 2.07017 25.7087 2.469C25.6852 2.80422 25.5751 3.12784 25.3887 3.41C25.2107 3.67566 24.9718 3.89799 24.6865 4.06856C24.4012 4.23913 24.0765 4.354 23.7463 4.408H22.325ZM5.0125 19C5.0125 19 4.785 18.985 4.78375 18.7725C4.7825 18.56 4.78 17.5605 4.78 17.5605L3.78375 17.5235H3.78125L3.03 17.5C3.03 17.5 3.035 18.1685 3.03125 18.5055C3.02981 18.7394 2.93049 18.962 2.75905 19.1243C2.58761 19.2865 2.35893 19.3741 2.125 19.363C1.89107 19.3741 1.66239 19.2865 1.49095 19.1243C1.31951 18.962 1.22019 18.7394 1.21875 18.5055C1.215 18.1685 1.22 17.5 1.22 17.5L0.5 17.523C0.5 17.523 0.5 18.56 0.49875 18.7725C0.4975 18.985 0.235 19 0.235 19C0.098332 19.0239 -0.00508219 19.1433 0.000179008 19.28C0.00544021 19.4167 0.118253 19.5247 0.255 19.5384L4.99375 19.5495C5.13049 19.5358 5.24331 19.4278 5.24856 19.2911C5.25382 19.1544 5.15041 19.0239 5.0125 19ZM3.78375 17.5235L2.125 17.473L0.5 17.523L3.78375 17.5235ZM3.035 0.333C3.035 0.333 3.035 0.4165 3.035 0.592C3.035 0.592 3.035 0.5005 3.035 0.333ZM25.7237 0.333C25.7237 0.5005 25.7237 0.592 25.7237 0.592C25.7237 0.4165 25.7237 0.333 25.7237 0.333Z" fill="black"/>
          </svg>
          Continue with Apple
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email address"
            className="h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="h-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-1.5">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300" 
              checked={isSignUp}
              onChange={() => setIsSignUp(!isSignUp)}
            />
            <span>Create a new account</span>
          </label>
        </div>
        
        <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800">
          {isSignUp ? 'Sign Up' : 'Sign In'} with Email
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
