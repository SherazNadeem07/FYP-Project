'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import { useRouter } from 'next/navigation';

const AuthForm = ({ mode, role, toggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

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
        const response = await mockLogin(email, password);
        if (response.success) {
          dispatch(loginSuccess({
            user: { email, role, fullName: response.fullName },
            token: response.token
          }));
          router.push(role === 'entrepreneur'
            ? '/dashboard/entrepreneur'
            : '/dashboard/investor');
        } else {
          setError('Invalid email or password');
        }
      } else {
        const response = await mockSignup(email, password, role, fullName);
        if (response.success) {
          toggleMode(); // switch to login
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFullName('');
        } else {
          setError(response.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Safe mock login using localStorage
  const mockLogin = async (email, password) => {
    if (typeof window === 'undefined') return { success: false };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    return {
      success: !!user,
      token: user ? `mock-token-${Math.random().toString(36).substring(2)}` : null,
      fullName: user?.fullName || ''
    };
  };

  const mockSignup = async (email, password, role, fullName) => {
    if (typeof window === 'undefined') return { success: false, message: 'Client only' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    users.push({ email, password, role, fullName });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {mode === 'signup' && (
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {loading
          ? 'Please wait...'
          : `${mode === 'login' ? 'Login' : 'Signup'} as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
      </button>
    </form>
  );
};

export default AuthForm;
