"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset password');
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => router.push('/auth'), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-md border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>

        {message && (
          <div className="p-2 bg-green-900/20 border border-green-800 rounded-md mb-4">
            <p className="text-green-500 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-900/20 border border-red-800 rounded-md mb-4">
            <p className="text-[#D0140F] text-sm">{error}</p>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="New Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="New password"
                className="w-full p-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Confirm new password"
                className="w-full p-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              aria-disabled={loading || !token}
              className={`w-full bg-[#D0140F] hover:bg-[#B0100D] text-white py-2 px-4 rounded-md font-semibold transition ${
                loading || !token ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => router.push('/auth')}
                className="text-[#D0140F] hover:underline text-sm bg-transparent border-none cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}