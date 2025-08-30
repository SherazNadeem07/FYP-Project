'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [token, setToken] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(urlToken);
      setValidToken(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
        <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-md">
            <p className="text-[#D0140F]">{error}</p>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/forgot-password')}
              className="text-[#D0140F] hover:underline text-sm bg-transparent border-none cursor-pointer"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>
        
        {message && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-md mb-4">
            <p className="text-green-400 text-sm">{message}</p>
            <p className="text-green-400 text-sm mt-2">Redirecting to login page...</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-md mb-4">
            <p className="text-[#D0140F] text-sm">{error}</p>
          </div>
        )}
        
        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#D0140F] hover:bg-[#B0100D] text-white py-2 px-4 rounded-lg ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="text-center mt-4">
              <button
                onClick={() => router.push('/auth')}
                className="text-[#D0140F] hover:underline text-sm bg-transparent border-none cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}