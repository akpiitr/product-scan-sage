
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { scanBarcode, scanImage, requestCameraPermission } from '@/utils/scanUtils';
import Navigation from '@/components/Navigation';
import { toast } from "@/hooks/use-toast";
import ScanHeader from '@/components/scan/ScanHeader';
import ScanMethodSelection from '@/components/scan/ScanMethodSelection';
import CameraPermissionError from '@/components/scan/CameraPermissionError';
import CameraView from '@/components/scan/CameraView';
import { captureImageFromVideo, stopCameraStream } from '@/services/cameraService';

const Scan = () => {
  const navigate = useNavigate();
  const { addProduct, setCurrentProduct } = useProducts();
  
  const [scanMethod, setScanMethod] = useState<'barcode' | 'image' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
    };
  }, []);
  
  const handleScan = async (barcodeValue?: string) => {
    setIsScanning(true);
    setErrorMessage(null);
    
    try {
      let product;
      
      if (scanMethod === 'barcode') {
        // Use the detected barcode if available, otherwise use a mock value
        const barcode = barcodeValue || '3017620422003'; // Default to a common product barcode (Nutella)
        
        console.log(`Processing barcode: ${barcode}`);
        toast({
          title: "Scanning Barcode",
          description: `Barcode detected: ${barcode}`,
        });
        
        product = await scanBarcode(barcode);
      } else {
        // Capture image from camera
        const imageData = captureImageFromVideo(videoRef.current, canvasRef.current);
        if (!imageData) {
          throw new Error('Failed to capture image');
        }
        
        toast({
          title: "Processing Image",
          description: "Analyzing product image...",
        });
        
        // Scan the captured image
        product = await scanImage(imageData);
      }
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Add product to context
      addProduct(product);
      setCurrentProduct(product);
      
      toast({
        title: "Product Found",
        description: `Found: ${product.name} by ${product.brand}`,
      });
      
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
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
  };
  
  // Render the appropriate UI based on state
  const renderContent = () => {
    if (!hasPermission && errorMessage) {
      return <CameraPermissionError errorMessage={errorMessage} />;
    }
    
    if (!scanMethod) {
      return <ScanMethodSelection onSelectMethod={setScanMethod} />;
    }
    
    return (
      <CameraView 
        isScanning={isScanning}
        scanMethod={scanMethod}
        onCapture={handleScan}
        streamRef={streamRef}
        videoRef={videoRef}
        canvasRef={canvasRef}
      />
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <ScanHeader 
        showClose={!!scanMethod} 
        onClose={resetScan} 
      />
      
      <main className="flex-1 flex flex-col">
        {renderContent()}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Scan;
