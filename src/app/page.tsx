'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import RegistrationForm from '@/app/components/RegistrationForm';

export default function HomePage() {
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

      {/* ✅ Main Content */}
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
          Automate book issuing returning and overdue tracking using QR codes and WhatsApp alerts.
        </p>

        {/* ✅ Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            href="/scan"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
             Scan QR
          </Link>
          <Link
            href="/issue"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
             Issue Book
          </Link>
          <Link
            href="/return"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
             Return Book
          </Link>
          <Link
            href="/books"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
             View Books
          </Link>
          <Link
            href="/admin"
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
          >
             Admin Panel
          </Link>
        </div>

        {/* ✅ Registration Form */}
        <RegistrationForm />
      </div>
    </main>
  );
}
