
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductContextType } from './ProductContextTypes';
import { SkinProfile, Product } from '@/models/product';
import { useProductStorage } from '@/hooks/useProductStorage';

// Re-export types from models
export type { SkinType, SkinProfile, IngredientAnalysis, ProductAnalysis, Product } from '@/models/product';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get storage operations
  const { 
    products, 
    setProducts, 
    skinProfile, 
    setSkinProfile, 
    isLoading 
  } = useProductStorage(userId);

  // Get recently scanned products (last 5)
  const recentlyScanned = [...products]
    .sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime())
    .slice(0, 5);

  // Get favorite products
  const favorites = products.filter(product => product.favorite);

  const addProduct = (product: Product) => {
    setProducts(prev => {
      // Check if product already exists
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        // Update existing product
        return prev.map(p => p.id === product.id ? { ...product, dateScanned: new Date() } : p);
      }
      // Add new product
      return [...prev, { ...product, dateScanned: new Date() }];
    });
  };

  const toggleFavorite = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, favorite: !product.favorite } 
          : product
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        recentlyScanned,
        favorites,
        skinProfile,
        currentProduct,
        setCurrentProduct,
        addProduct,
        toggleFavorite,
        setSkinProfile,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
