'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export default function ViewBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios.get('/api/books').then((res) => {
      setBooks(res.data.books || []);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Available Books</h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded shadow-sm bg-gray-50 space-y-2">
              <h3 className="text-lg font-semibold text-blue-700">{book.title}</h3>
              <p><strong>Author:</strong> {book.author || 'Unknown'}</p>
              <p><strong>Total Copies:</strong> {book.totalCopies}</p>
              <p><strong>Available:</strong> {book.availableCopies}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
