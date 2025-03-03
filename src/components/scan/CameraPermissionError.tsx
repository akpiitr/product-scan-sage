
import React from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CameraPermissionErrorProps {
  errorMessage: string;
}

const CameraPermissionError: React.FC<CameraPermissionErrorProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <Camera size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Camera Access Required</h2>
      <p className="text-gray-300 mb-6">{errorMessage}</p>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-white text-black font-medium rounded-lg"
      >
        Return to Home
      </button>
    </div>
  );
};

export default CameraPermissionError;
