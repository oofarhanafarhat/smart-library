// File: src/app/issue/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phoneNumber?: string;
}

interface Book {
  id: string;
  title: string;
  availableCopies: number;
}

export default function IssuePage() {
  const searchParams = useSearchParams();
  const studentIdFromQR = searchParams.get("studentId");

  const [student, setStudent] = useState<Student | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Set today's date as default issue date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setIssueDate(today);
  }, []);

  // ✅ Fetch student by scanned studentId
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentIdFromQR) return;

      try {
        const res = await axios.get(`/api/students/${studentIdFromQR}`);
        setStudent(res.data.student);
        setMessage(""); // clear any previous error
      } catch (err: any) {
        if (err.response?.status === 403) {
          setMessage("❌ Student not approved yet");
        } else {
          setMessage("❌ Student not found");
        }
      }
    };

    fetchStudent();
  }, [studentIdFromQR]);

  // ✅ Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/books");
        setBooks(res.data.books);
      } catch {
        setMessage("❌ Failed to fetch books");
      }
    };

    fetchBooks();
  }, []);

  // ✅ Issue Book handler
  const handleIssue = async () => {
    if (!student) {
      setMessage("❌ Student not loaded");
      return;
    }

    if (!selectedBook || !issueDate || !returnDate) {
      setMessage("❌ Please fill all fields");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (issueDate < today) {
      setMessage("❌ Issue date cannot be in the past");
      return;
    }

    if (returnDate < issueDate) {
      setMessage("❌ Return date cannot be before issue date");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/issue-book", {
        studentId: student.studentId,
        bookId: selectedBook,
        issueDate,
        returnDate,
      });

      setMessage("✅ Book issued successfully");
      setSelectedBook("");
      setReturnDate("");
      setIssueDate(today); // reset
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">📚 Issue Book</h2>

      {/* ✅ Student Info or Loading/Error */}
      {student ? (
        <div className="bg-gray-100 p-4 rounded space-y-1">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>ID:</strong> {student.studentId}</p>
        </div>
   
      ) : (
        <p className="text-red-500">{message || "Fetching student..."}</p>
      )}

      {/* ✅ Book Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Select Book</label>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select --</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.availableCopies} available)
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Dates */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // block past dates
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={issueDate} // can't pick before issue date
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* ✅ Submit Button */}
      <button
        onClick={handleIssue}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
      >
        {loading ? "Issuing..." : "Issue Book"}
      </button>

      {/* ✅ Message */}
      {message && (
        <div
          className={`mt-4 text-center font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}