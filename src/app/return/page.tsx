'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';

export default function ReturnBookPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannedId, setScannedId] = useState('');
  const [message, setMessage] = useState('');
  const [bookTitle, setBookTitle] = useState('');

  // ✅ QR Scanning logic
  useEffect(() => {
    const interval = setInterval(() => {
      const webcam = webcamRef.current;
      const canvas = canvasRef.current;

      if (
        webcam &&
        webcam.video &&
        canvas &&
        webcam.video.readyState === 4
      ) {
        const video = webcam.video as HTMLVideoElement;

        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && !scannedId) {
          const scanned = code.data.trim();
          setScannedId(scanned);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scannedId]);

  // ✅ Submit return book
  const handleReturn = async () => {
    if (!scannedId) {
      setMessage(" Please scan a student QR code");
      return;
    }

    try {
      const res = await axios.post('/api/return-book', {
        studentId: scannedId,
      });

      if (res.data.message && res.data.bookTitle) {
        setBookTitle(res.data.bookTitle);
        setMessage(` Book "${res.data.bookTitle}" returned successfully`);
      } else {
        setMessage(" No unreturned book found for this student");
      }
    } catch (err: unknown) {
      console.error(err);
      setMessage(" Failed to return book");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center space-y-4">
      <h2 className="text-xl font-bold">Return Book via QR</h2>

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
        <>
          <p className="text-blue-700 font-medium">Scanned ID: {scannedId}</p>

          <button
            onClick={handleReturn}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Return Book
          </button>
        </>
      )}

      {message && (
        <div
          className={`mt-4 font-semibold text-lg ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
