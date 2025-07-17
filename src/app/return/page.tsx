'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
}

export default function ReturnBookPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scannedId, setScannedId] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [message, setMessage] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(false);

  
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

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && !scannedId) {
          const id = code.data.trim();
          console.log("Scanned QR Code:", id);
          setScannedId(id);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scannedId]);

  // ✅ Fetch books
  useEffect(() => {
    if (!scannedId) return;

    setLoadingBooks(true);
    setMessage('');

    axios
      .get(`/api/issue-book?studentId=${scannedId}`)
      .then((res) => {
        setBooks(res.data.books || []);
      })
      .catch((err:unknown) => {
        console.error(err);
        setMessage("Failed to load books.");
      })
      .finally(() => setLoadingBooks(false));
  }, [scannedId]);

  // ✅ Return handler
  const handleReturn = async () => {
    if (!scannedId || !selectedBook || loadingBooks) {
      setMessage("Please wait... QR and book list loading");
      return;
    }

    try {
      await axios.post('/api/return-book', {
        studentId: scannedId,
        bookId: selectedBook,
      });

      setMessage("Book returned successfully ");
      setBooks((prev) => prev.filter((book) => book.id!== selectedBook));
      setSelectedBook('');
    } catch (err: unknown) {
      console.error(err);
      setMessage("Failed to return book");
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
          <p className="text-sm text-gray-500">Scan student QR code to begin</p>
        </>
      )}

      {scannedId && (
        <>
          <p className="text-blue-700 font-medium">Scanned ID: {scannedId}</p>

          {loadingBooks ? (
            <p className="text-sm text-gray-500">Loading issued books...</p>
          ) : books.length === 0 ? (
            <p className="text-sm text-gray-500">No issued books found.</p>
          ) : (
            <>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">-- Select Book --</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleReturn}
                disabled={!selectedBook || loadingBooks}
                className={`w-full ${
                  loadingBooks
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold py-2 px-4 rounded`}
              >
                {loadingBooks ? "Loading..." : "Return Book"}
              </button>
            </>
          )}
        </>
      )}

      {message && (
        <div
          className={`mt-4 font-semibold text-lg ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
