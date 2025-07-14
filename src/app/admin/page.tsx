"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  qrCode: string;
  isApproved: boolean;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/students?status=all");
      setStudents(res.data.students || []);
    } catch (error:unknown) {
      console.error("Error fetching students", error);
    }
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`/api/students/${id}/approve`);
      setMessage(" Student approved!");
      fetchStudents();
    } catch {
      setMessage(" Failed to approve student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const pending = students.filter((s) => !s.isApproved);
  const approved = students.filter((s) => s.isApproved);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-800">
          Admin Dashboard
        </h1>

        {message && (
          <div className="bg-green-100 text-green-800 border border-green-300 p-3 rounded text-center font-medium">
            {message}
          </div>
        )}

        {/* Pending Students */}
        <section>
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
             Pending Students
          </h2>
          {pending.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pending.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-lg p-5 space-y-3 border-l-4 border-yellow-400"
                >
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>ID:</strong> {student.studentId}</p>
                  <p><strong>Phone:</strong> {student.phoneNumber || "N/A"}</p>
                  <img
                    src={student.qrCode}
                    alt="QR Code"
                    className="w-24 h-24 border border-gray-200 rounded"
                  />
                  <button
                    onClick={() => handleApprove(student.id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2 w-full transition duration-200"
                    disabled={loading}
                  >
                     Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved Students */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mt-10 mb-4">
             Approved Students
          </h2>
          {approved.length === 0 ? (
            <p className="text-gray-500">No approved students yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approved.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow p-5 space-y-3 border-l-4 border-green-500"
                >
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>ID:</strong> {student.studentId}</p>
                  <p><strong>Phone:</strong> {student.phoneNumber || "N/A"}</p>
                  <img
                    src={student.qrCode}
                    alt="QR Code"
                    className="w-24 h-24 border border-gray-200 rounded"
                  />
                  <p className="text-green-600 font-medium">Approved</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
