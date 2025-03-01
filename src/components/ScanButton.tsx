
import React from 'react';
import { Camera } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  isScanning?: boolean;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onClick, isScanning = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isScanning}
      className={`
        scan-button
        relative
        w-20 h-20
        rounded-full
        bg-brand-accent
        text-white
        flex items-center justify-center
        scan-shadow
        focus:outline-none
        transition-all
        ${isScanning ? 'opacity-70' : 'hover:bg-opacity-90 active:bg-opacity-100'}
      `}
      aria-label="Scan Product"
    >
      {isScanning ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Camera size={32} strokeWidth={1.5} />
      )}
    </button>
  );
};

export default ScanButton;
