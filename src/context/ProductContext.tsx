
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isInDemoMode } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  saveUserProducts, 
  getUserProducts, 
  saveSkinProfile, 
  getSkinProfile 
} from '@/services/databaseService';
import { useToast } from '@/hooks/use-toast';

export type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';

export interface SkinProfile {
  type: SkinType;
  concerns: string[];
  allergies: string[];
}

export interface IngredientAnalysis {
  name: string;
  effect: 'good' | 'neutral' | 'caution' | 'avoid';
  description: string;
}

export interface ProductAnalysis {
  overallRating: 1 | 2 | 3 | 4 | 5;
  safetyScore: number;
  matchScore: number;
  summary: string;
  ingredients: IngredientAnalysis[];
  goodFor: string[];
  warnings: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  barcode?: string;
  analysis: ProductAnalysis;
  dateScanned: Date;
  favorite: boolean;
}

interface ProductContextType {
  products: Product[];
  recentlyScanned: Product[];
  favorites: Product[];
  skinProfile: SkinProfile | null;
  currentProduct: Product | null;
  setCurrentProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  toggleFavorite: (productId: string) => void;
  setSkinProfile: (profile: SkinProfile) => void;
  isLoading: boolean;
}

const defaultSkinProfile: SkinProfile = {
  type: 'normal',
  concerns: [],
  allergies: [],
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>(defaultSkinProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get recently scanned products (last 5)
  const recentlyScanned = [...products]
    .sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime())
    .slice(0, 5);

  // Get favorite products
  const favorites = products.filter(product => product.favorite);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    
    return () => unsubscribe();
  }, []);

  // Load data from Firestore or localStorage based on authentication status
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // If user is authenticated, load from Firestore
        if (userId) {
          // Load products
          const userProductsData = await getUserProducts(userId);
          if (userProductsData) {
            // Convert string dates back to Date objects
            const productsWithDates = userProductsData.products.map((product: any) => ({
              ...product,
              dateScanned: new Date(product.dateScanned)
            }));
            setProducts(productsWithDates);
          }
          
          // Load skin profile
          const userSkinProfile = await getSkinProfile(userId);
          if (userSkinProfile) {
            setSkinProfile(userSkinProfile);
          }
        }
        // If user is not authenticated or in demo mode, load from localStorage
        else {
          const storedProducts = localStorage.getItem('products');
          const storedProfile = localStorage.getItem('skinProfile');
          
          if (storedProducts) {
            try {
              const parsedProducts = JSON.parse(storedProducts);
              // Convert string dates back to Date objects
              const productsWithDates = parsedProducts.map((product: any) => ({
                ...product,
                dateScanned: new Date(product.dateScanned)
              }));
              setProducts(productsWithDates);
            } catch (error) {
              console.error('Failed to parse stored products:', error);
            }
          }
          
          if (storedProfile) {
            try {
              setSkinProfile(JSON.parse(storedProfile));
            } catch (error) {
              console.error('Failed to parse stored skin profile:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId, toast]);

  // Save to Firestore when data changes and user is authenticated
  useEffect(() => {
    const saveToDatabase = async () => {
      if (userId && !isLoading && products.length > 0) {
        try {
          await saveUserProducts(userId, products);
        } catch (error) {
          console.error('Failed to save products to database:', error);
        }
      }
    };
    
    if (!isInDemoMode) {
      saveToDatabase();
    }
  }, [products, userId, isLoading]);

  // Save skin profile to Firestore when it changes and user is authenticated
  useEffect(() => {
    const saveToDatabase = async () => {
      if (userId && !isLoading) {
        try {
          await saveSkinProfile(userId, skinProfile);
        } catch (error) {
          console.error('Failed to save skin profile to database:', error);
        }
      }
    };
    
    if (!isInDemoMode) {
      saveToDatabase();
    }
  }, [skinProfile, userId, isLoading]);

  // Always save to localStorage as a backup
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('skinProfile', JSON.stringify(skinProfile));
  }, [skinProfile]);

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
