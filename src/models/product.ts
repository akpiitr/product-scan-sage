
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

export const defaultSkinProfile: SkinProfile = {
  type: 'normal',
  concerns: [],
  allergies: [],
};
