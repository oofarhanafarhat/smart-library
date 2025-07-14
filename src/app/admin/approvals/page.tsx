"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs"; // 👈 import user from Clerk

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  qrCode: string;
  approved: boolean;
}

export default function AdminApprovalsPage() {
  const { user, isLoaded } = useUser(); // 👈 get user info
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    const res = await axios.get("/api/students?status=pending");
    setStudents(res.data.students || []);
  };

  useEffect(() => {
    if (user) fetchStudents();
  }, [user]);

  const handleApprove = async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`/api/students/${id}/approve`);
      setMessage("✅ Student approved!");
      fetchStudents(); // refresh list
    } catch {
      setMessage("❌ Failed to approve student");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ Show loading
  if (!isLoaded) return <div className="text-center mt-10">Loading...</div>;

  const adminEmails = ["farhanafarhat012@gmail.com", "khnkaneez@gmail.com"];

if (!adminEmails.includes(user?.primaryEmailAddress?.emailAddress || "")) {
  return <div>🚫 Unauthorized</div>;
}

  // ✅ Authorized content
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">🛡️ Admin - Approve Students</h2>

      {message && <p className="text-center text-green-600">{message}</p>}

      {students.length === 0 ? (
        <p className="text-center text-gray-500">No pending students.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="border p-4 rounded shadow space-y-2 bg-gray-50"
            >
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>ID:</strong> {student.studentId}</p>
              <img src={student.qrCode} alt="QR Code" className="w-32 h-32" />
              <button
                onClick={() => handleApprove(student.id)}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                disabled={loading}
              >
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
