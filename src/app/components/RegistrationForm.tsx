'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

export default function StudentRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    const id = `STD-${Date.now()}`;
    setStudentId(id);

    const qr = await QRCode.toDataURL(id);
    setQrImage(qr);

    const res = await fetch('/api/students', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phoneNumber, // ✅ Add this field
        studentId: id,
        qrCode: qr,
      }),
    });

    if (res.ok) {
      setMessage('✅ Student registered successfully!');
    } else {
      setMessage('❌ Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl mt-10 shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">📋 Student Registration</h2>

 <input
  type="text"
  placeholder="Full Name"
  className="w-full p-2 border rounded text-black"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<input
  type="email"
  placeholder="Email Address"
  className="w-full p-2 border rounded text-black"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<input
  type="text"
  placeholder="WhatsApp Number international format(e.g. +923001234567)"
  className="w-full p-2 border rounded text-black"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
/>


      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Generate QR Code
      </button>

{message && (
  <p className={`text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
    {message}
  </p>
)}
{qrImage && (
  <div className="text-center mt-4 space-y-2">
    <p className="font-semibold">🎉 Student ID: {studentId}</p>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phoneNumber}</p>
    <img src={qrImage} alt="QR Code" className="mx-auto border p-2 rounded-lg shadow" />

    <p className="mt-4 text-sm text-gray-600">
      📌 <span className="font-medium">Please save this QR code</span> as a screenshot or print it for future use.
    </p>
    <p className="mt-4 text-sm text-green-600">
      Thank you for registering.
Your account is currently pending approval by the library admin.

 Once your registration is approved, you will be able to scan your QR code and issue books from the library.

Please wait for approval — you will be notified soon
    </p>
  </div>
)}

    </div>
  );
}
