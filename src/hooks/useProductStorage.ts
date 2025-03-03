
import { useState, useEffect } from 'react';
import { Product, SkinProfile, defaultSkinProfile } from '@/models/product';
import { 
  saveUserProducts, 
  getUserProducts, 
  saveSkinProfile, 
  getSkinProfile 
} from '@/services/databaseService';
import { isInDemoMode } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export const useProductStorage = (userId: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>(defaultSkinProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

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

  return {
    products,
    setProducts,
    skinProfile,
    setSkinProfile,
    isLoading
  };
};
