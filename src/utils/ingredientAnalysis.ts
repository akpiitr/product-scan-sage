
import { IngredientAnalysis, SkinType } from '@/context/ProductContext';

// Mock database of ingredients and their effects
const ingredientDatabase: Record<string, {
  effect: 'good' | 'neutral' | 'caution' | 'avoid';
  description: string;
  goodFor?: SkinType[];
  badFor?: SkinType[];
}> = {
  'Water': {
    effect: 'neutral',
    description: 'Base ingredient used in most skincare products.',
  },
  'Glycerin': {
    effect: 'good',
    description: 'Humectant that draws moisture to the skin.',
    goodFor: ['dry', 'normal', 'combination', 'sensitive'],
  },
  'Hyaluronic Acid': {
    effect: 'good',
    description: 'Powerful humectant that can hold up to 1000x its weight in water.',
    goodFor: ['dry', 'normal', 'combination', 'sensitive', 'oily'],
  },
  'Dimethicone': {
    effect: 'caution',
    description: 'Silicone that creates a barrier on skin. May cause breakouts for some people.',
    badFor: ['oily', 'sensitive'],
  },
  'Fragrance': {
    effect: 'avoid',
    description: 'Can cause irritation and allergic reactions, especially for sensitive skin.',
    badFor: ['sensitive'],
  },
  'Phenoxyethanol': {
    effect: 'caution',
    description: 'Preservative that can cause irritation in high concentrations.',
    badFor: ['sensitive'],
  },
  'Sodium Hydroxide': {
    effect: 'caution',
    description: 'pH adjuster that can be irritating in high concentrations.',
    badFor: ['sensitive'],
  },
  'Sodium Hyaluronate': {
    effect: 'good',
    description: 'A salt form of hyaluronic acid that hydrates the skin.',
    goodFor: ['dry', 'normal', 'combination', 'sensitive', 'oily'],
  },
  'Ceramide NP': {
    effect: 'good',
    description: 'Helps restore and maintain the skin barrier.',
    goodFor: ['dry', 'normal', 'sensitive'],
  },
  'Ceramide AP': {
    effect: 'good',
    description: 'Supports skin barrier function and helps retain moisture.',
    goodFor: ['dry', 'normal', 'sensitive'],
  },
  'Ceramide EOP': {
    effect: 'good',
    description: "Helps fortify the skin's natural barrier.",
    goodFor: ['dry', 'normal', 'sensitive'],
  },
  'Cholesterol': {
    effect: 'good',
    description: 'Natural component of the skin that helps maintain its barrier.',
    goodFor: ['dry', 'normal', 'sensitive'],
  },
  'Ascorbic Acid': {
    effect: 'good',
    description: 'Vitamin C that brightens skin and provides antioxidant protection.',
    goodFor: ['normal', 'combination', 'oily'],
  },
  'Ferulic Acid': {
    effect: 'good',
    description: 'Antioxidant that enhances the stability and efficacy of vitamin C.',
    goodFor: ['normal', 'combination', 'oily'],
  },
  'Tocopheryl Acetate': {
    effect: 'good',
    description: 'Form of Vitamin E, an antioxidant that protects skin from free radicals.',
    goodFor: ['dry', 'normal', 'combination'],
  },
};

// Analyze a list of ingredients
export const analyzeIngredients = (ingredients: string[]): IngredientAnalysis[] => {
  return ingredients.map(ingredient => {
    const knownIngredient = ingredientDatabase[ingredient];
    
    if (knownIngredient) {
      return {
        name: ingredient,
        effect: knownIngredient.effect,
        description: knownIngredient.description
      };
    }
    
    // For unknown ingredients, return neutral
    return {
      name: ingredient,
      effect: 'neutral',
      description: 'Limited information available for this ingredient.'
    };
  });
};

// Generate summary from ingredient analysis
export const generateSummary = (
  ingredientAnalysis: IngredientAnalysis[],
  ingredients: string[]
) => {
  // Count ingredients by effect
  const counts = {
    good: 0,
    neutral: 0,
    caution: 0,
    avoid: 0
  };
  
  ingredientAnalysis.forEach(ing => {
    counts[ing.effect]++;
  });
  
  // Calculate safety score (0-100)
  const totalCount = ingredientAnalysis.length;
  const weightedScore = 
    (counts.good * 100 + 
     counts.neutral * 70 + 
     counts.caution * 30 + 
     counts.avoid * 0) / totalCount;
  
  const safetyScore = Math.round(weightedScore);
  
  // Determine overall rating (1-5)
  let overallRating: 1 | 2 | 3 | 4 | 5;
  if (safetyScore >= 90) overallRating = 5;
  else if (safetyScore >= 75) overallRating = 4;
  else if (safetyScore >= 60) overallRating = 3;
  else if (safetyScore >= 40) overallRating = 2;
  else overallRating = 1;
  
  // Create summary text
  let summary = '';
  if (overallRating >= 4) {
    summary = `This product contains ${counts.good} beneficial ingredients that can help improve your skin. `;
    if (counts.avoid > 0) {
      summary += `However, it does contain ${counts.avoid} potentially concerning ingredients to be aware of.`;
    } else if (counts.caution > 0) {
      summary += `It has ${counts.caution} ingredients that may cause issues for some skin types.`;
    } else {
      summary += `Overall, it appears to be a well-formulated product.`;
    }
  } else if (overallRating === 3) {
    summary = `This product has a mix of ${counts.good} beneficial ingredients and ${counts.caution + counts.avoid} potentially problematic ones. Consider your skin's specific needs before using.`;
  } else {
    summary = `This product contains ${counts.avoid} concerning ingredients that may cause irritation or other issues. `;
    if (counts.good > 0) {
      summary += `While it does have ${counts.good} beneficial ingredients, there are likely better alternatives available.`;
    } else {
      summary += `We recommend looking for alternative products with safer ingredients.`;
    }
  }
  
  // Determine what skin types it might be good for
  const goodFor: string[] = [];
  if (ingredients.some(ing => ing === 'Hyaluronic Acid' || ing === 'Glycerin')) {
    goodFor.push('Hydration');
  }
  if (ingredients.some(ing => ing === 'Ceramide NP' || ing === 'Ceramide AP' || ing === 'Ceramide EOP')) {
    goodFor.push('Strengthening skin barrier');
  }
  if (ingredients.some(ing => ing === 'Ascorbic Acid' || ing === 'Ferulic Acid')) {
    goodFor.push('Brightening');
    goodFor.push('Antioxidant protection');
  }
  
  // Determine warnings
  const warnings: string[] = [];
  if (ingredients.includes('Fragrance')) {
    warnings.push('Contains fragrance which may cause irritation for sensitive skin');
  }
  if (ingredients.includes('Dimethicone')) {
    warnings.push('Contains silicones which may cause breakouts for acne-prone skin');
  }
  
  // Match score for personalization (in real app would use user profile)
  const matchScore = Math.round(Math.random() * 30 + 70); // Random score between 70-100
  
  return {
    overallRating,
    safetyScore,
    matchScore,
    summary,
    goodFor,
    warnings
  };
};
