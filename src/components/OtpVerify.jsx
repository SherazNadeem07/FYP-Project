'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OtpVerify() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = (e) => {
    e.preventDefault();
    // Simulate OTP success
    setSubmitted(true);
    setTimeout(() => {
      alert(`Your password for ${email} is: 12345678`);
      router.push('/auth');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Enter OTP</h2>
        <p className="text-sm text-center text-[#B3B3B3] mb-6">
          An OTP has been sent to <span className="text-white font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          />
          <button
            type="submit"
            disabled={submitted}
            className="w-full bg-[#D0140F] hover:bg-[#B0100D] text-white py-2 px-4 rounded-lg"
          >
            {submitted ? 'Verifying...' : 'Verify OTP'}
          </button>
          <p className="text-center text-sm text-[#AAAAAA]">
            Time Remaining: <span className="text-[#D0140F] font-semibold">{timer}s</span>
          </p>
        </form>
      </div>
    </div>
  );
}
