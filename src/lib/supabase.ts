
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use the direct values from your Supabase project
const supabaseUrl = "https://jxcihfcgdatzbjnssyui.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y2loZmNnZGF0emJqbnNzeXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTYzODIsImV4cCI6MjA1ODE5MjM4Mn0.mkATyi1IwXBf7hRP5jWHmw9pzcA4Z_MTVfqyVycl5q4";

// Check if we're in demo mode (missing env variables)
export const isInDemoMode = false;

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
