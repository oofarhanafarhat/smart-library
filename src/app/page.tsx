"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import RegistrationForm from "@/app/components/RegistrationForm";

export default function HomePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
  });
  const [qr, setQr] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage("");
    setQr("");

    if (!form.name || !form.email || !form.studentId) {
      setMessage("❌ Please fill all fields");
      return;
    }

    try {
      // 1. Generate QR code
      const qrRes = await axios.post("/api/generate-qr", {
        studentId: form.studentId,
      });

      const qrCode = qrRes.data.qrCode;

      // 2. Register student
      await axios.post("/api/students", {
        ...form,
        qrCode,
      });

      setQr(qrCode);
      setMessage("✅ Registration submitted! Wait for admin approval.");
      setForm({ name: "", email: "", studentId: "" });
    } catch (err) {
      setMessage("❌ Registration failed");
    }
  };

  return (
    <main className="relative min-h-screen w-full text-white overflow-hidden pb-20">
      {/* ✅ Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/bg.jpeg"
          alt="Library background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Smart Library Management System
        </motion.h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6">
          Automate book issuing, returning, and overdue tracking using QR codes, WhatsApp alerts, and email reminders.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            href="/scan"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
            📷 Scan QR
          </Link>
          <Link
            href="/issue"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
            🧾 Issue Book
          </Link>
          <Link
            href="/return"  // ← یہاں نیا بٹن add کریں
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
            🔄 Return Book
          </Link>
          <Link
            href="/books"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
            📚 View Books
          </Link>
          <Link
            href="/admin"
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
            ⚙️ Admin Panel
          </Link>
        </div>

        <RegistrationForm />

      </div>
    </main>
  );
}
