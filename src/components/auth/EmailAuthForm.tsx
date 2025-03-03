
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
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 12.536c0.031 3.012 2.67 4.023 2.698 4.033-0.022 0.072-0.433 1.462-1.431 2.894-0.862 1.244-1.758 2.485-3.166 2.506-1.383 0.023-1.828-0.813-3.411-0.813-1.582 0-2.076 0.786-3.386 0.836-1.358 0.052-2.394-1.348-3.263-2.588-1.774-2.532-3.131-7.155-1.309-10.282 0.9-1.553 2.516-2.536 4.263-2.562 1.33-0.024 2.582 0.886 3.393 0.886 0.81 0 2.333-1.095 3.936-0.935 0.67 0.027 2.552 0.267 3.761 2.018-0.097 0.06-2.248 1.29-2.224 3.851M14.345 3.761c0.716-0.855 1.198-2.043 1.066-3.23-1.031 0.042-2.278 0.677-3.016 1.532-0.662 0.753-1.242 1.961-1.087 3.115 1.151 0.088 2.325-0.57 3.037-1.417" fill="black"/>
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
