
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we're in demo mode
export const isInDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL === 'https://your-project-url.supabase.co';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
