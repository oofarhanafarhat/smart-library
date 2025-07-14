// app/scan/page.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

export default function QRScannerModern() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannedId, setScannedId] = useState('');
 const [error, setError] = useState('');

useEffect(() => {
  const interval = setInterval(() => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;

    if (!webcam || !webcam.video) {
      setError('Webcam not available');
      return;
    }

    if (
      webcam.video.readyState !== 4 ||
      webcam.video.videoWidth === 0 ||
      webcam.video.videoHeight === 0
    ) {
      // Video stream not ready yet—no error, bas wait karo
      return;
    }

    const video = webcam.video as HTMLVideoElement;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) {
      setError('Canvas context not found');
      return;
    }

    setError(''); // ✅ sab theek, error clear karo

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && !scannedId) {
      setScannedId(code.data);
      window.location.href = `/issue?studentId=${code.data}`;
    }
  }, 1000);

  return () => clearInterval(interval);
}, [scannedId]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center">
      <h2 className="text-xl font-bold mb-4">Scan Student QR Code</h2>

      {!scannedId && (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            className="w-full rounded"
          />
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}

      {scannedId && (
        <div className="mt-4">
          <p className="text-green-700 font-semibold">Scanned ID: {scannedId}</p>
          {/* TODO: fetch student info here */}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
