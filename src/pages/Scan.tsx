
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { scanBarcode, scanImage, requestCameraPermission } from '@/utils/scanUtils';
import Navigation from '@/components/Navigation';
import { Camera, Barcode, ArrowLeft, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Scan = () => {
  const navigate = useNavigate();
  const { addProduct, setCurrentProduct } = useProducts();
  
  const [scanMethod, setScanMethod] = useState<'barcode' | 'image' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check camera permission
  useEffect(() => {
    const checkPermission = async () => {
      const result = await requestCameraPermission();
      setHasPermission(result);
      if (!result) {
        setErrorMessage('Camera access denied. Please enable camera permissions in your browser settings.');
      }
    };
    
    checkPermission();
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Start the camera when scan method is selected
  useEffect(() => {
    if (scanMethod && hasPermission && videoRef.current) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [scanMethod, hasPermission]);
  
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
      setErrorMessage('Failed to start camera. Please try again or use a different device.');
      setHasPermission(false);
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get data URL from canvas
    return canvas.toDataURL('image/jpeg');
  };
  
  const handleCapture = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    
    try {
      let product;
      
      if (scanMethod === 'barcode') {
        // In a real app, you'd scan the barcode from the camera feed
        // For this demo, we'll use a mock barcode
        const mockBarcode = '123456789012';
        product = await scanBarcode(mockBarcode);
      } else {
        // Capture image from camera
        const imageData = captureImage();
        if (!imageData) {
          throw new Error('Failed to capture image');
        }
        
        // Scan the captured image
        product = await scanImage(imageData);
      }
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Add product to context
      addProduct(product);
      setCurrentProduct(product);
      
      // Navigate to product details
      navigate(`/product/${product.id}`);
      
    } catch (error) {
      console.error('Scan error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const resetScan = () => {
    setScanMethod(null);
    setErrorMessage(null);
    stopCamera();
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        {scanMethod && (
          <button
            onClick={resetScan}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
            aria-label="Cancel scan"
          >
            <X size={20} />
          </button>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {!hasPermission && errorMessage ? (
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
        ) : !scanMethod ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">How would you like to scan?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <button 
                onClick={() => setScanMethod('barcode')}
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
                onClick={() => setScanMethod('image')}
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
        ) : (
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
                onClick={handleCapture}
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
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Scan;
