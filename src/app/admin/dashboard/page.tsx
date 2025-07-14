"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  isApproved: boolean;
  phoneNumber: string | null;
  createdAt: string;
}

const adminEmails = ["farhanafarhat012@gmail.com", "khnkaneez@gmail.com"];

export default function AdminDashboardPage() {
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/students"); // ✅ Create API route if needed
        setStudents(res.data.students || []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (!user || !adminEmails.includes(user.primaryEmailAddress?.emailAddress || "")) {
    return <div className="text-center mt-10 text-red-600">🚫 Unauthorized</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">📊 Admin Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading students...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Approved</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="p-2 border">{student.name}</td>
                  <td className="p-2 border">{student.email}</td>
                  <td className="p-2 border">{student.studentId}</td>
                  <td className="p-2 border">{student.phoneNumber || "N/A"}</td>
                  <td className="p-2 border">
                    {student.isApproved ? "✅" : "⏳"}
                  </td>
                  <td className="p-2 border">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
