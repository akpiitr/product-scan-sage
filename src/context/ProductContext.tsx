import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load from localStorage on mount
  useEffect(() => {
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
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('skinProfile', JSON.stringify(skinProfile));
  }, [skinProfile]);

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
