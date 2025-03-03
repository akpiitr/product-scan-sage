
// This file integrates barcode scanning functionality with product API

import { Product } from '@/models/product';
import { fetchProductByBarcode } from '@/services/barcodeApiService';
import { analyzeIngredients, generateSummary } from './ingredientAnalysis';

// Mock database for fallback when API fails
const mockProductDatabase: Record<string, Omit<Product, 'analysis' | 'dateScanned' | 'favorite'>> = {
  '123456789012': {
    id: 'p1',
    name: 'Hydra Boost Gel Cream',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    image: '/placeholder.svg',
    barcode: '123456789012',
  },
  '223456789012': {
    id: 'p2',
    name: 'Daily Facial Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    image: '/placeholder.svg',
    barcode: '223456789012',
  },
  '323456789012': {
    id: 'p3',
    name: 'Vitamin C Serum',
    brand: 'Timeless',
    category: 'Serum',
    image: '/placeholder.svg',
    barcode: '323456789012',
  },
};

// Mock ingredient lists for fallback products
const mockIngredients: Record<string, string[]> = {
  'p1': [
    'Water', 'Dimethicone', 'Glycerin', 'Hyaluronic Acid', 'Sodium Hydroxide',
    'Phenoxyethanol', 'Tocopheryl Acetate', 'Fragrance'
  ],
  'p2': [
    'Water', 'Glycerin', 'Cocamidopropyl Hydroxysultaine', 'Sodium Chloride',
    'Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Hyaluronic Acid', 'Cholesterol'
  ],
  'p3': [
    'Water', 'Ascorbic Acid', 'Ethoxydiglycol', 'Propylene Glycol', 'Vitamin E',
    'Ferulic Acid', 'Sodium Hyaluronate', 'Phenoxyethanol', 'Citric Acid'
  ],
};

export const scanBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    // First try to fetch product from API
    const product = await fetchProductByBarcode(barcode);
    if (product) {
      return product;
    }
    
    console.log('Product not found in API, falling back to mock database');
    
    // Fall back to mock database if API doesn't have the product
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if barcode exists in our mock database
    const productInfo = mockProductDatabase[barcode];
    
    if (!productInfo) {
      return null;
    }

    // Get ingredients for this product
    const ingredients = mockIngredients[productInfo.id] || [];
    
    // Analyze ingredients
    const ingredientAnalysis = analyzeIngredients(ingredients);
    
    // Generate summary
    const summary = generateSummary(ingredientAnalysis, ingredients);

    // Create full product with analysis
    const product: Product = {
      ...productInfo,
      analysis: {
        overallRating: summary.overallRating,
        safetyScore: summary.safetyScore,
        matchScore: summary.matchScore,
        summary: summary.summary,
        ingredients: ingredientAnalysis,
        goodFor: summary.goodFor,
        warnings: summary.warnings,
      },
      dateScanned: new Date(),
      favorite: false
    };

    return product;
  } catch (error) {
    console.error('Error in scanBarcode:', error);
    throw new Error('Failed to scan barcode');
  }
};

export const scanImage = async (imageData: string): Promise<Product | null> => {
  // In a real app, this would send the image to a computer vision API to detect barcodes
  // For now, we'll randomly select a product from our mock database
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This would normally extract a barcode from the image
  // For now, we'll just use a random mock barcode
  const allBarcodes = Object.keys(mockProductDatabase);
  const randomBarcode = allBarcodes[Math.floor(Math.random() * allBarcodes.length)];
  
  return scanBarcode(randomBarcode);
};

// Function to handle camera permission
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop all tracks to release the camera
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Error accessing camera:', error);
    return false;
  }
};
