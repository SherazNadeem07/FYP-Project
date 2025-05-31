'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import { useRouter } from 'next/navigation';

const AuthForm = ({ mode, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // password character length for signup
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      if (mode === 'login') {
        // call Real API in future
        const response = await mockLogin(email, password);
        
        if (response.success) {
          dispatch(loginSuccess({
            user: { email, role },
            token: response.token
          }));
          router.push(role === 'entrepreneur'
            ? '/dashboard/entrepreneur'
            : '/dashboard/investor');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Signup mode
        const response = await mockSignup(email, password, role);
        
        if (response.success) {
          // After successful signup, switch to login mode
          router.push('/auth');
        } else {
          setError(response.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Mock API functions - replace with API in future
  const mockLogin = async (email, password) => {
    // It will check against your database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    return {
      success: !!user,
      token: user ? `mock-token-${Math.random().toString(36).substring(2)}` : null
    };
  };

  const mockSignup = async (email, password, role) => {
    // It would create a user in database in future
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    users.push({ email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {mode === 'login' ? 'Login' : 'Signup'} as {role.charAt(0).toUpperCase() + role.slice(1)}
      </button>
    </form>
  );
};

export default AuthForm;