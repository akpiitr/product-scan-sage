
import React from 'react';
import { Product } from '@/context/ProductContext';
import { Heart } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  hideActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, hideActions = false }) => {
  const { toggleFavorite, setCurrentProduct } = useProducts();
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };
  
  const handleCardClick = () => {
    setCurrentProduct(product);
  };
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Determine border color based on safety score
  const getBorderColor = (score: number) => {
    if (score >= 80) return 'border-brand-success';
    if (score >= 60) return 'border-brand-warning';
    return 'border-brand-danger';
  };
  
  return (
    <Link
      to={`/product/${product.id}`}
      onClick={handleCardClick}
      className={`
        block w-full
        bg-white dark:bg-gray-900
        border ${getBorderColor(product.analysis.safetyScore)}
        rounded-xl
        overflow-hidden
        transition-all duration-300
        hover:shadow-md
        animate-scale-in
      `}
    >
      <div className="flex">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="flex-1 p-3 relative">
          {!hideActions && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 text-gray-400 hover:text-brand-danger focus:outline-none"
              aria-label={product.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={18}
                fill={product.favorite ? 'currentColor' : 'none'}
                className={product.favorite ? 'text-brand-danger' : ''}
              />
            </button>
          )}
          
          <div className="space-y-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{product.brand}</div>
            <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium
                  ${product.analysis.overallRating >= 4 ? 'bg-brand-success' : 
                    product.analysis.overallRating >= 3 ? 'bg-brand-warning' : 'bg-brand-danger'}
                `}>
                  {product.analysis.overallRating}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Score</span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(product.dateScanned)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
