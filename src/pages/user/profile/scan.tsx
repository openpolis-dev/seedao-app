import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

interface QrScannerProps {
  isScanning: boolean;
  onScanResult: (result: string | null) => void;
  onError?: (error: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ isScanning, onScanResult, onError }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    if (!webcamRef.current || !isScanning) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setTimeout(capture, 300);
        return;
      }

      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          onError?.('无法获取画布上下文');
          return;
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          onScanResult(code.data);
        } else {
          setTimeout(capture, 300);
        }
      };

      image.onerror = () => {
        setTimeout(capture, 300);
      };
    } catch (err) {
      onError?.(`扫描错误: ${err instanceof Error ? err.message : String(err)}`);
      setTimeout(capture, 300);
    }
  };

  useEffect(() => {
    if (isScanning) {
      capture();
    }
  }, [isScanning]);

  if(!isScanning) return null;

  return (
    <div style={{
      margin: '0 auto',
      border: '2px solid #ced4da',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment' }}
        style={{ width: '100%', display: 'block' }}
      />
    </div>
  );
};

export default QrScanner;
