
import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  isScanning: boolean;
  scanMethod: 'barcode' | 'image';
  onCapture: () => void;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

const CameraView: React.FC<CameraViewProps> = ({
  isScanning,
  scanMethod,
  onCapture,
  streamRef,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set up the camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Error starting camera:', error);
      }
    };
    
    startCamera();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [streamRef]);
  
  return (
    <div className="relative flex-1 flex flex-col">
      {/* Camera Preview */}
      <div className="flex-1 bg-black relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scanning overlay */}
        <div className={`absolute inset-0 ${scanMethod === 'barcode' ? 'flex flex-col items-center justify-center' : ''}`}>
          {scanMethod === 'barcode' && (
            <div className="w-3/4 h-1/4 border-2 border-white/50 rounded-lg relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white translate-x-1 translate-y-1" />
              <div className="absolute left-1/2 top-1/2 w-full transform -translate-x-1/2 -translate-y-1/2">
                <div className={`h-0.5 bg-brand-accent ${isScanning ? 'animate-pulse' : ''}`} />
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-center text-sm mb-12">
            {scanMethod === 'barcode' 
              ? 'Position the barcode within the frame' 
              : 'Position the product in the center of the frame'}
          </p>
        </div>
      </div>
      
      {/* Capture Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={onCapture}
          disabled={isScanning}
          className={`
            w-16 h-16 rounded-full border-4 border-white
            ${isScanning 
              ? 'bg-gray-400 animate-pulse' 
              : 'bg-white'
            }
            focus:outline-none
          `}
          aria-label="Capture"
        >
          {isScanning && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraView;
