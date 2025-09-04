
"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

const AuthForm = ({ mode, role, toggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Full name is required.');
        setLoading(false);
        return;
      }
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
    }

    try {
      if (mode === 'login') {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store token in localStorage
        console.log('Storing token in localStorage:', data.token);
        localStorage.setItem('token', data.token);

        // Store token in cookies for middleware
        setCookie('token', data.token, { maxAge: 7 * 24 * 60 * 60 }); // 7 days

        // Dispatch login success to Redux
        dispatch(
          loginSuccess({
            user: {
              id: data.user.id,
              email: data.user.email,
              role: data.user.role,
              fullName: data.user.full_name,
            },
            token: data.token,
          })
        );

        // Redirect based on role
        router.push(
          data.user.role === 'entrepreneur'
            ? '/dashboard/entrepreneur'
            : '/dashboard/investor'
        );
      } else {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
            fullName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        // Show success message and switch to login mode
        alert('Account created successfully! Please login.');
        toggleMode();
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      }
    } catch (err) {
      console.error('Auth error:', err.message);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    router.push('/auth/forgot');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {mode === 'login' && (
        <div className="text-right text-sm">
          <button
            type="button"
            onClick={handleForgot}
            className="text-[#D0140F] hover:underline cursor-pointer bg-transparent border-none"
          >
            Forgot Password?
          </button>
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-900/20 border border-red-800 rounded-md">
          <p className="text-[#D0140F] text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#D0140F] text-white py-2 cursor-pointer rounded-md hover:bg-[#B0100D] transition font-semibold ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {loading
          ? 'Please wait...'
          : `${mode === 'login' ? 'Login' : 'Signup'} as ${
              role.charAt(0).toUpperCase() + role.slice(1)
            }`}
      </button>
    </form>
  );
};

export default AuthForm;
