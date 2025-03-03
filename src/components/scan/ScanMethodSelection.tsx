
import React from 'react';
import { Barcode, Camera } from 'lucide-react';

interface ScanMethodSelectionProps {
  onSelectMethod: (method: 'barcode' | 'image') => void;
}

const ScanMethodSelection: React.FC<ScanMethodSelectionProps> = ({ onSelectMethod }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">How would you like to scan?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button 
          onClick={() => onSelectMethod('barcode')}
          className="bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center mb-3">
            <Barcode size={24} className="text-brand-accent" />
          </div>
          <h3 className="text-lg font-medium mb-1">Scan Barcode</h3>
          <p className="text-sm text-gray-300">
            Point camera at the product's barcode for quick identification
          </p>
        </button>
        
        <button 
          onClick={() => onSelectMethod('image')}
          className="bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center mb-3">
            <Camera size={24} className="text-brand-accent" />
          </div>
          <h3 className="text-lg font-medium mb-1">Scan Product</h3>
          <p className="text-sm text-gray-300">
            Take a photo of the product or its ingredient list
          </p>
        </button>
      </div>
    </div>
  );
};

export default ScanMethodSelection;
