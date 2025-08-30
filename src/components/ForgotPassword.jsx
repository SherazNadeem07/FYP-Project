'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setMessage(data.message);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
        
        {message && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-md mb-4">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-md mb-4">
            <p className="text-[#D0140F] text-sm">{error}</p>
          </div>
        )}
        
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
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
              disabled={loading}
              className={`w-full bg-[#D0140F] hover:bg-[#B0100D] text-white py-2 px-4 rounded-lg ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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
        ) : (
          <div className="text-center">
            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-md mb-4">
              <p className="text-blue-400">
                Check your email for a password reset link. 
                If you don't see it, check your spam folder.
              </p>
            </div>
            <button
              onClick={() => router.push('/auth')}
              className="text-[#D0140F] hover:underline text-sm bg-transparent border-none cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}