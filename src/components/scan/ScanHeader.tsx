
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScanHeaderProps {
  showClose?: boolean;
  onClose?: () => void;
}

const ScanHeader: React.FC<ScanHeaderProps> = ({ showClose = false, onClose }) => {
  const navigate = useNavigate();
  
  return (
    <header className="relative z-10 px-4 py-4 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      
      {showClose && (
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
          aria-label="Cancel scan"
        >
          <X size={20} />
        </button>
      )}
    </header>
  );
};

export default ScanHeader;
