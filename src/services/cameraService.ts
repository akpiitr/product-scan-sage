export const startCamera = async (videoElement: HTMLVideoElement): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        console.log("✅ Camera started successfully.");
        resolve(stream);
      };
    });
  } catch (err) {
    console.error("❌ Error accessing camera:", err);
    return null;
  }
};

export const captureImageFromVideo = async (
  videoElement: HTMLVideoElement | null,
  canvasElement: HTMLCanvasElement | null
): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!videoElement) {
      console.error("❌ Error: videoElement is null.");
      resolve(null);
      return;
    }

    if (!canvasElement) {
      console.error("❌ Error: canvasElement is null.");
      resolve(null);
      return;
    }

    // Ensure video is ready before capturing
    if (videoElement.readyState < 2) {
      console.error("❌ Error: Video is not ready.");
      resolve(null);
      return;
    }

    if (!videoElement.srcObject) {
      console.error("❌ Error: No active camera stream detected.");
      resolve(null);
      return;
    }

    console.log("📷 Attempting to capture image...");
    console.log("Video dimensions:", videoElement.videoWidth, videoElement.videoHeight);

    // Small delay to ensure the video frame is stable before capturing
    setTimeout(() => {
      try {
        // Set canvas dimensions to match video frame
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        const ctx = canvasElement.getContext('2d');
        if (!ctx) {
          console.error("❌ Error: Failed to get 2D context.");
          resolve(null);
          return;
        }

        // Draw the current video frame on the canvas
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Convert the canvas to an image data URL
        const imageData = canvasElement.toDataURL('image/jpeg');
        if (!imageData) {
          console.error("❌ Error: Failed to convert canvas to image data URL.");
          resolve(null);
          return;
        }

        console.log("✅ Image captured successfully.");
        resolve(imageData);
      } catch (err) {
        console.error("❌ Error: Capturing image failed.", err);
        resolve(null);
      }
    }, 500); // Delay of 500ms to allow the video feed to stabilize
  });
};

export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      console.log(`🚫 Stopped track: ${track.kind}`);
    });
    console.log("✅ Camera stream stopped.");
  } else {
    console.error("❌ Error: No active camera stream found.");
  }
};
