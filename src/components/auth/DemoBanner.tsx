
import React from 'react';

interface DemoBannerProps {
  isDemo: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ isDemo }) => {
  if (!isDemo) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
      <p className="text-sm">
        <strong>Demo Mode:</strong> Using mock authentication. Set up Firebase to enable real authentication.
      </p>
    </div>
  );
};
