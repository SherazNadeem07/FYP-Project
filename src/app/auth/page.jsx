'use client';
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';

const AuthPage = () => {
  const [role, setRole] = useState('entrepreneur');
  const [mode, setMode] = useState('login');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-2 capitalize">
          {mode === 'login' ? 'Login' : 'Sign Up'} as {role}
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          {role === 'entrepreneur'
            ? 'Pitch your ideas, find investors, and grow your startup.'
            : 'Explore innovative ideas and invest in the future.'}
        </p>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole('entrepreneur')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              role === 'entrepreneur'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Entrepreneur
          </button>
          <button
            onClick={() => setRole('investor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              role === 'investor'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Investor
          </button>
        </div>

        {/* Form */}
        <AuthForm mode={mode} role={role} toggleMode={toggleMode} />

        {/* Toggle login/signup */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
