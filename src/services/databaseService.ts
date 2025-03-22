
import { toast } from "sonner";
import { supabase, isInDemoMode } from "../lib/supabase";
import { Product, SkinProfile } from "@/context/ProductContext";

// Mock in-memory database for demo mode
const mockDatabase: Record<string, Record<string, any>> = {
  users: {},
  products: {},
  skinProfiles: {}
};

// User profile functions
export const saveUserProfile = async (
  userId: string, 
  profileData: Record<string, any>
): Promise<void> => {
  if (isInDemoMode) {
    mockDatabase.users[userId] = profileData;
    console.log('[DEMO] Saved user profile:', profileData);
    return;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    toast.success("Profile updated successfully");
  } catch (error: any) {
    console.error("Error saving profile:", error);
    toast.error(error.message || "Failed to save profile");
    throw error;
  }
};

export const getUserProfile = async (
  userId: string
): Promise<Record<string, any> | null> => {
  if (isInDemoMode) {
    return mockDatabase.users[userId] || null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Product-specific functions
export const saveUserProducts = async (
  userId: string, 
  products: Product[]
): Promise<void> => {
  if (isInDemoMode) {
    mockDatabase.products[userId] = products;
    console.log('[DEMO] Saved products:', products.length);
    return;
  }

  try {
    // Delete existing products for user
    const { error: deleteError } = await supabase
      .from('user_products')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Insert new products
    if (products.length > 0) {
      const productsToInsert = products.map(product => ({
        user_id: userId,
        product_data: product,
        date_scanned: product.dateScanned,
        is_favorite: product.favorite || false
      }));

      const { error } = await supabase
        .from('user_products')
        .insert(productsToInsert);

      if (error) throw error;
    }
  } catch (error: any) {
    console.error("Error saving products:", error);
    // Don't show toast for background sync
  }
};

export const getUserProducts = async (
  userId: string
): Promise<{ products: Product[] } | null> => {
  if (isInDemoMode) {
    return { products: mockDatabase.products[userId] || [] };
  }

  try {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', userId)
      .order('date_scanned', { ascending: false });

    if (error) throw error;
    
    if (!data) return { products: [] };
    
    // Convert from database format to app format
    const products = data.map(item => ({
      ...item.product_data,
      favorite: item.is_favorite,
      dateScanned: new Date(item.date_scanned)
    }));
    
    return { products };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
};

// Skin profile functions
export const saveSkinProfile = async (
  userId: string, 
  skinProfile: SkinProfile
): Promise<void> => {
  if (isInDemoMode) {
    mockDatabase.skinProfiles[userId] = skinProfile;
    console.log('[DEMO] Saved skin profile');
    return;
  }

  try {
    const { error } = await supabase
      .from('skin_profiles')
      .upsert({
        user_id: userId,
        profile_data: skinProfile,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    // Success is handled by the caller
  } catch (error: any) {
    console.error("Error saving skin profile:", error);
    toast.error(error.message || "Failed to save skin profile");
    throw error;
  }
};

export const getSkinProfile = async (
  userId: string
): Promise<SkinProfile | null> => {
  if (isInDemoMode) {
    return mockDatabase.skinProfiles[userId] || null;
  }

  try {
    const { data, error } = await supabase
      .from('skin_profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.profile_data || null;
  } catch (error: any) {
    console.error("Error fetching skin profile:", error);
    return null;
  }
};
