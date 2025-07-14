// app/student-registration/page.tsx
'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

export default function StudentRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [qrImage, setQrImage] = useState('');

  const handleRegister = async () => {
    const id = `${name}-${Date.now()}`;
    setStudentId(id);

    const qr = await QRCode.toDataURL(id);
    setQrImage(qr);

    // Optionally, POST this to your database
    await fetch('/api/students', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        studentId: id,
        qrCode: qr,
      }),
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl mt-10 shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Student Registration</h2>
      <input
        type="text"
        placeholder="Student Name"
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Generate QR Code
      </button>

      {qrImage && (
        <div className="text-center mt-4">
          <p className="font-semibold mb-2">Student ID: {studentId}</p>
          <img src={qrImage} alt="QR Code" className="mx-auto" />
        </div>
      )}
    </div>
  );
}
