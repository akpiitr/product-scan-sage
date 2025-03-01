
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import ScanButton from '@/components/ScanButton';
import Navigation from '@/components/Navigation';
import { PlusCircle, ChevronRight, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { recentlyScanned, favorites, skinProfile } = useProducts();
  
  const goToScan = () => {
    navigate('/scan');
  };
  
  const goToProfile = () => {
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <header className="pt-10 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight">ProductSense</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Scan and analyze your skincare products
          </p>
        </header>
        
        {/* Main Content */}
        <main className="space-y-8">
          {/* Quick Scan Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg font-medium mb-2">Analyze a Product</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Scan a product barcode or take a photo to see its ingredients analysis
              </p>
              <ScanButton onClick={goToScan} />
            </div>
          </div>
          
          {/* Skin Profile Status */}
          {!skinProfile || 
           (!skinProfile.concerns.length && !skinProfile.allergies.length) ? (
            <div className="bg-brand-light dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="font-medium">Set up your skin profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Get personalized product recommendations based on your skin type
                  </p>
                </div>
                <button 
                  onClick={goToProfile}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-accent text-white flex-shrink-0"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Your Skin Profile</h3>
                <button
                  onClick={goToProfile}
                  className="text-sm text-brand-accent flex items-center"
                >
                  Edit <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="bg-brand-light dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                  {skinProfile.type.charAt(0).toUpperCase() + skinProfile.type.slice(1)}
                </div>
                {skinProfile.concerns.slice(0, 3).map((concern, index) => (
                  <div key={index} className="bg-brand-light dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                    {concern}
                  </div>
                ))}
                {skinProfile.concerns.length > 3 && (
                  <div className="bg-brand-light dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                    +{skinProfile.concerns.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Recent Scans */}
          {recentlyScanned.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Recently Scanned</h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-sm text-brand-accent flex items-center"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {recentlyScanned.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          {/* Favorites */}
          {favorites.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Favorites</h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-sm text-brand-accent flex items-center"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {favorites.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          {/* Filler when no content */}
          {recentlyScanned.length === 0 && favorites.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-brand-light dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-brand-accent" />
              </div>
              <h3 className="font-medium mb-2">Get started!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan your first product to build your personal library of analyzed products.
              </p>
            </div>
          )}
        </main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Index;
