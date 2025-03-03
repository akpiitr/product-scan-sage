
import { Product } from '@/models/product';
import { analyzeIngredients, generateSummary } from '@/utils/ingredientAnalysis';

// We'll use Open Food Facts API as our product database
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product/';

export interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name: string;
    brands: string;
    categories: string;
    image_url: string;
    ingredients_text: string;
  };
  status: number;
  status_verbose: string;
}

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product data for barcode: ${barcode}`);
    
    // Make API request to Open Food Facts
    const response = await fetch(`${OPEN_FOOD_FACTS_API}${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json() as OpenFoodFactsProduct;
    
    // Check if product was found
    if (data.status !== 1 || !data.product) {
      console.log('Product not found in database');
      return null;
    }
    
    // Extract ingredients from product data
    const ingredientsText = data.product.ingredients_text || '';
    const ingredients = ingredientsText
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
    
    // Analyze ingredients using existing utility functions
    const ingredientAnalysis = analyzeIngredients(ingredients);
    const summary = generateSummary(ingredientAnalysis, ingredients);
    
    // Create product object
    const product: Product = {
      id: `product-${barcode}`,
      name: data.product.product_name || 'Unknown Product',
      brand: data.product.brands || 'Unknown Brand',
      category: data.product.categories?.split(',')[0] || 'Uncategorized',
      image: data.product.image_url || '/placeholder.svg',
      barcode: barcode,
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
    console.error('Error fetching product data:', error);
    throw new Error('Failed to fetch product information');
  }
};
