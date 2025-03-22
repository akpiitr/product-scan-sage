
import { useState, useEffect } from 'react';
import { Product, SkinProfile, defaultSkinProfile } from '@/models/product';
import { 
  saveUserProducts, 
  getUserProducts, 
  saveSkinProfile, 
  getSkinProfile 
} from '@/services/databaseService';
import { isInDemoMode } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useProductStorage = (userId: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>(defaultSkinProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  // Load data from Firestore or localStorage based on authentication status
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setIsInitialized(false); // Reset initialization flag when user changes
      
      try {
        // If user is authenticated, load from Firestore
        if (userId) {
          console.log(`Loading data for user ${userId} from Firestore`);
          
          // Load skin profile
          const userSkinProfile = await getSkinProfile(userId);
          if (userSkinProfile) {
            console.log('SUCCESSFULLY loaded skin profile from database:', userSkinProfile);
            setSkinProfile(userSkinProfile);
          } else {
            console.log('No saved skin profile found in database, using default');
            // If no skin profile exists in the database, use the default
            setSkinProfile(defaultSkinProfile);
          }
          
          // Load products
          const userProductsData = await getUserProducts(userId);
          if (userProductsData) {
            // Convert string dates back to Date objects
            const productsWithDates = userProductsData.products.map((product: any) => ({
              ...product,
              dateScanned: new Date(product.dateScanned)
            }));
            setProducts(productsWithDates);
            console.log(`Loaded ${productsWithDates.length} products from database`);
          }
        }
        // If user is not authenticated or in demo mode, load from localStorage
        else {
          console.log('No user ID provided, loading from localStorage');
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
              const parsedProfile = JSON.parse(storedProfile);
              console.log('Loaded skin profile from localStorage:', parsedProfile);
              setSkinProfile(parsedProfile);
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
        setIsInitialized(true); // Mark as initialized after loading completes (success or failure)
        console.log('Data loading completed, isInitialized set to true');
      }
    };
    
    loadData();
  }, [userId, toast]); // Only react to userId changes

  // Save to Firestore when skin profile changes and user is authenticated
  useEffect(() => {
    const saveToDatabase = async () => {
      if (userId && isInitialized && !isLoading) {
        try {
          console.log('Saving skin profile to database:', skinProfile);
          await saveSkinProfile(userId, skinProfile);
          toast({
            title: "Success",
            description: "Your skin profile has been saved.",
          });
        } catch (error) {
          console.error('Failed to save skin profile to database:', error);
          toast({
            title: "Error",
            description: "Failed to save your skin profile. Please try again.",
            variant: "destructive"
          });
        }
      }
    };
    
    if (!isInDemoMode && userId && isInitialized) {
      saveToDatabase();
    }
  }, [skinProfile, userId, isLoading, isInitialized, toast]);

  // Save to Firestore when products change and user is authenticated
  useEffect(() => {
    const saveToDatabase = async () => {
      if (userId && isInitialized && !isLoading && products.length > 0) {
        try {
          await saveUserProducts(userId, products);
          console.log(`Saved ${products.length} products to database`);
        } catch (error) {
          console.error('Failed to save products to database:', error);
        }
      }
    };
    
    if (!isInDemoMode && userId && isInitialized) {
      saveToDatabase();
    }
  }, [products, userId, isLoading, isInitialized]);

  // Always save to localStorage as a backup
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('skinProfile', JSON.stringify(skinProfile));
    }
  }, [skinProfile, isInitialized]);

  return {
    products,
    setProducts,
    skinProfile,
    setSkinProfile,
    isLoading
  };
};
