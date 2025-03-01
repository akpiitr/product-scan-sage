
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Search, Filter, Heart, Clock } from 'lucide-react';

type FilterType = 'all' | 'favorites';
type SortType = 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated';

const History = () => {
  const navigate = useNavigate();
  const { products, favorites } = useProducts();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter products based on selected filter and search query
  const filteredProducts = React.useMemo(() => {
    let filtered = filterType === 'all' ? products : favorites;
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime();
        case 'oldest':
          return new Date(a.dateScanned).getTime() - new Date(b.dateScanned).getTime();
        case 'highest-rated':
          return b.analysis.overallRating - a.analysis.overallRating;
        case 'lowest-rated':
          return a.analysis.overallRating - b.analysis.overallRating;
        default:
          return 0;
      }
    });
  }, [products, favorites, filterType, sortType, searchQuery]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium">Your Products</h1>
        </header>
        
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 mb-4">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-2 px-2 text-sm focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`
                flex items-center px-3 py-1.5 rounded-full text-sm
                ${filterType === 'all' 
                  ? 'bg-brand-accent text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
              `}
            >
              <Clock size={14} className="mr-1" />
              All
            </button>
            
            <button
              onClick={() => setFilterType('favorites')}
              className={`
                flex items-center px-3 py-1.5 rounded-full text-sm
                ${filterType === 'favorites' 
                  ? 'bg-brand-danger text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
              `}
            >
              <Heart size={14} className="mr-1" />
              Favorites
            </button>
            
            <div className="flex-1"></div>
            
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm pl-3 pr-8 py-1.5 rounded-full focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="lowest-rated">Lowest Rated</option>
              </select>
              <Filter size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Product List */}
        <main className="p-4">
          {filteredProducts.length > 0 ? (
            <div className="space-y-3 animate-fade-in">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={24} className="text-gray-400" />
              </div>
              <h3 className="font-medium mb-2">No products found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search term' : 
                  filterType === 'favorites' ? 'You haven\'t added any favorites yet' : 
                  'Start scanning products to build your collection'}
              </p>
            </div>
          )}
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default History;
