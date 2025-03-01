
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import IngredientAnalysis from '@/components/IngredientAnalysis';
import Navigation from '@/components/Navigation';
import { Heart, Share2, ArrowLeft, Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, currentProduct, setCurrentProduct, toggleFavorite } = useProducts();
  
  // Find product by ID if not in current product
  useEffect(() => {
    if (!currentProduct && productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setCurrentProduct(product);
      } else {
        // Product not found, redirect to home
        navigate('/', { replace: true });
      }
    }
  }, [productId, products, currentProduct, setCurrentProduct, navigate]);
  
  // Clean up current product on unmount
  useEffect(() => {
    return () => {
      setCurrentProduct(null);
    };
  }, [setCurrentProduct]);
  
  const handleFavoriteToggle = () => {
    if (currentProduct) {
      toggleFavorite(currentProduct.id);
      toast({
        title: currentProduct.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${currentProduct.name} has been ${currentProduct.favorite ? "removed from" : "added to"} your favorites`,
      });
    }
  };
  
  const handleShare = () => {
    // In a real app, implement share functionality
    toast({
      title: "Share feature",
      description: "This feature would share product information via native share APIs",
    });
  };
  
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Determine rating text based on overall rating
  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return "Excellent";
      case 4: return "Very Good";
      case 3: return "Good";
      case 2: return "Fair";
      case 1: return "Poor";
      default: return "Unrated";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="relative bg-white dark:bg-gray-800 pt-safe-top">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="h-64 flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-700">
            <img
              src={currentProduct.image || '/placeholder.svg'}
              alt={currentProduct.name}
              className="max-h-full max-w-full object-contain animate-fade-in"
            />
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              {currentProduct.brand}
            </div>
            <h1 className="text-2xl font-medium">{currentProduct.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentProduct.category}
            </p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-2
                  ${currentProduct.analysis.overallRating >= 4 ? 'bg-brand-success' : 
                    currentProduct.analysis.overallRating >= 3 ? 'bg-brand-warning' : 'bg-brand-danger'}
                `}>
                  {currentProduct.analysis.overallRating}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {getRatingText(currentProduct.analysis.overallRating)}
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        size={12} 
                        className={`
                          ${i < currentProduct.analysis.overallRating 
                            ? 'text-brand-warning fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleFavoriteToggle}
                  className={`
                    w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center
                    ${currentProduct.favorite ? 'text-brand-danger' : 'text-gray-400 hover:text-brand-danger'}
                  `}
                  aria-label={currentProduct.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart fill={currentProduct.favorite ? "currentColor" : "none"} size={20} />
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-4">
          <IngredientAnalysis
            ingredients={currentProduct.analysis.ingredients}
            summary={currentProduct.analysis.summary}
            safetyScore={currentProduct.analysis.safetyScore}
            matchScore={currentProduct.analysis.matchScore}
            goodFor={currentProduct.analysis.goodFor}
            warnings={currentProduct.analysis.warnings}
          />
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default ProductDetails;
