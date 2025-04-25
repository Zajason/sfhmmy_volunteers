import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

interface FastQRScannerProps {
  onScan: (decodedText: string) => void;
  facingMode?: 'environment' | 'user';
  style?: React.CSSProperties;
}

const FastQRScanner: React.FC<FastQRScannerProps> = ({ onScan, facingMode = 'environment', style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 100,
    });

    const startScanner = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const constraints = {
        video: {
          facingMode,
        },
      };

      const controls = await codeReader.decodeFromConstraints(
        constraints,
        videoElement,
        (result, err) => {
          if (result) {
            const text = result.getText();
            if (text !== lastScannedRef.current) {
              lastScannedRef.current = text;
              onScan(text);
              setTimeout(() => {
                lastScannedRef.current = null;
              }, 1000); // avoid rapid duplicate scans
            }
          }
        }
      );

      scannerControlsRef.current = controls;
    };

    startScanner();

    return () => {
      scannerControlsRef.current?.stop();
      
    };
  }, [facingMode, onScan]);

  return (
    <video
      ref={videoRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
        objectFit: 'cover',
        ...style,
      }}
      muted
      autoPlay
      playsInline
    />
  );
};

export default FastQRScanner;
