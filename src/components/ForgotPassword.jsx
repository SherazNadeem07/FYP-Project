    'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Fake OTP logic
    setSent(true);
    setTimeout(() => {
      router.push(`/auth/otp?email=${email}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          />
          <button
            type="submit"
            className="w-full bg-[#D0140F] hover:bg-[#B0100D] text-white py-2 px-4 rounded-lg"
          >
            {sent ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
