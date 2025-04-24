import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, Result } from '@zxing/library';

interface QRScannerProps {
  /**
   * Callback invoked with the decoded text when a QR code is detected
   */
  onScan: (decodedText: string) => void;
  /**
   * Camera facing mode: 'environment' for rear, 'user' for front
   */
  facingMode?: 'environment' | 'user';
  /**
   * Optional inline styling for the container
   */
  style?: React.CSSProperties;
}

/**
 * QRScanner Component (TypeScript)
 */
const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  facingMode = 'environment',
  style = {},
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let controls: { stop?: () => void } | null = null;

    const startScanning = async () => {
      try {
        // Enumerate video input devices
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error('No video input devices found');
        }

        // Select device matching facingMode or fallback to first
        const desiredDevice =
          videoInputDevices.find((device) => {
            const label = device.label.toLowerCase();
            return facingMode === 'environment'
              ? label.includes('back')
              : label.includes('front');
          }) || videoInputDevices[0];

        // Start decoding from the selected device
        codeReader
          .decodeFromVideoDevice(
            desiredDevice.deviceId,
            videoRef.current!,
            (result: Result | undefined, error: Error | undefined) => {
              if (result) {
                onScan(result.getText());
              }
              if (error && error.name !== 'NotFoundException') {
                console.warn('QR scanning error:', error);
              }
            }
          )
          .then(() => {
            controls = { stop: () => codeReader.reset() };
          })
          .catch((err) => {
            console.error('Error starting QR code scanner:', err);
            setErrorMessage((err as Error).message);
          });
      } catch (err) {
        console.error('Error initializing QR code scanner:', err);
        setErrorMessage((err as Error).message);
      }
    };

    startScanning();

    return () => {
      if (controls && typeof controls.stop === 'function') {
        controls.stop();
      }
      codeReader.reset();
    };
  }, [facingMode, onScan]);

  return (
    <div style={{ position: 'relative', ...style }}>
      {errorMessage ? (
        <p style={{ color: 'red' }}>Error: {errorMessage}</p>
      ) : (
        <video
          ref={videoRef}
          style={{ width: '100%', height: 'auto' }}
          muted
          playsInline
        />
      )}
    </div>
  );
};

export default QRScanner;
