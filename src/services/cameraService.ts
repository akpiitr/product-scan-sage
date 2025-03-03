
export const captureImageFromVideo = (
  videoElement: HTMLVideoElement | null,
  canvasElement: HTMLCanvasElement | null
): string | null => {
  if (!videoElement || !canvasElement) return null;
  
  // Set canvas dimensions to match video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  
  // Draw current video frame to canvas
  const ctx = canvasElement.getContext('2d');
  if (!ctx) return null;
  
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  
  // Get data URL from canvas
  return canvasElement.toDataURL('image/jpeg');
};

export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};
