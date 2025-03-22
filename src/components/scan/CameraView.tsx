
import React, { useRef, useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from 'lucide-react';

// Import the barcode detection library
// Note: This is a placeholder - in a real app you'd use a library like QuaggaJS or ZXing
declare global {
  interface Window {
    BarcodeDetector?: {
      getSupportedFormats(): Promise<string[]>;
      new(): {
        detect(source: ImageBitmapSource): Promise<Array<{rawValue: string; boundingBox: DOMRectReadOnly}>>;
      };
    }
  }
}

interface CameraViewProps {
  isScanning: boolean;
  scanMethod: 'barcode' | 'image';
  onCapture: (barcodeValue?: string) => void;
  streamRef: React.MutableRefObject<MediaStream | null>;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const CameraView: React.FC<CameraViewProps> = ({
  isScanning,
  scanMethod,
  onCapture,
  streamRef,
  videoRef,
  canvasRef
}) => {
  const [scanningActive, setScanningActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBarcodeSupported, setIsBarcodeSupported] = useState<boolean | null>(null);
  
  // Check for BarcodeDetector support
  useEffect(() => {
    const checkBarcodeSupport = async () => {
      if ('BarcodeDetector' in window) {
        try {
          const supportedFormats = await window.BarcodeDetector?.getSupportedFormats();
          setIsBarcodeSupported(supportedFormats?.includes('qr_code') || supportedFormats?.includes('ean_13'));
          console.log('Supported barcode formats:', supportedFormats);
        } catch (err) {
          console.error('Error checking barcode support:', err);
          setIsBarcodeSupported(false);
        }
      } else {
        console.log('BarcodeDetector not supported by browser');
        setIsBarcodeSupported(false);
      }
    };
    
    checkBarcodeSupport();
  }, []);
  
  // Set up the camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        setError(null);
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
        setError('Failed to access camera. Please check your camera permissions.');
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
  }, [streamRef, videoRef]);
  
  // Start continuous barcode scanning if supported
  useEffect(() => {
    let animationFrameId: number;
    let barcodeDetector: any;
    
    // Only start scanning if barcode method is selected and detector is supported
    if (scanMethod === 'barcode' && isBarcodeSupported && !isScanning) {
      // Create detector
      barcodeDetector = new window.BarcodeDetector!();
      
      const scanBarcode = async () => {
        if (!videoRef.current || !videoRef.current.readyState || videoRef.current.readyState < 2) {
          // Video not ready yet
          animationFrameId = requestAnimationFrame(scanBarcode);
          return;
        }
        
        try {
          // Only scan if video is playing and scanning is active
          if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended && scanningActive) {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            
            if (barcodes.length > 0) {
              // We found a barcode!
              console.log('Barcode detected:', barcodes[0].rawValue);
              setScanningActive(false);
              onCapture(barcodes[0].rawValue);
            }
          }
        } catch (error) {
          console.error('Barcode detection error:', error);
        }
        
        // Continue scanning
        if (scanningActive) {
          animationFrameId = requestAnimationFrame(scanBarcode);
        }
      };
      
      // Start scanning
      setScanningActive(true);
      scanBarcode();
    }
    
    return () => {
      // Stop scanning on cleanup
      setScanningActive(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scanMethod, isBarcodeSupported, isScanning, onCapture, videoRef]);
  
  // Handle capture button click
  const handleCaptureClick = () => {
    if (scanMethod === 'barcode') {
      // For barcode method, we just use the continuous scanning
      // For browsers without BarcodeDetector, we'll pass undefined and use the mock data
      onCapture();
    } else {
      // For image method, capture the current frame
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data from canvas
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Pass image data to parent component
        onCapture();
      }
    }
  };
  
  // Render placeholder while checking for barcode support
  if (isBarcodeSupported === null && scanMethod === 'barcode') {
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <Skeleton className="w-full h-full" />
        <p className="absolute text-white">Checking barcode support...</p>
      </div>
    );
  }
  
  // Show warning if barcode scanning is not supported
  if (isBarcodeSupported === false && scanMethod === 'barcode') {
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your browser doesn't support native barcode scanning. 
            We'll use a mock barcode for demonstration purposes.
          </AlertDescription>
        </Alert>
        
        <button
          onClick={() => onCapture()}
          className="mt-4 px-4 py-2 bg-brand-accent text-white rounded-md"
        >
          Continue with Mock Data
        </button>
      </div>
    );
  }
  
  return (
    <div className="relative flex-1 flex flex-col">
      {error && (
        <Alert variant="destructive" className="m-2">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
                <div className={`h-0.5 bg-brand-accent ${scanningActive ? 'animate-pulse' : ''}`} />
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
          onClick={handleCaptureClick}
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
