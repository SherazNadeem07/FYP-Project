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
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] p-6 text-[#E8E8E8]">
      <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-[#3A3A3A] shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-2 capitalize">
          {mode === 'login' ? 'Login' : 'Sign Up'} as {role}
        </h2>

        <p className="text-sm text-center text-[#B3B3B3] mb-6">
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
                ? 'bg-[#D0140F] text-white shadow'
                : 'bg-[#3A3A3A] text-[#E8E8E8] hover:bg-[#444]'
            }`}
          >
            Entrepreneur
          </button>
          <button
            onClick={() => setRole('investor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              role === 'investor'
                ? 'bg-[#D0140F] text-white shadow'
                : 'bg-[#3A3A3A] text-[#E8E8E8] hover:bg-[#444]'
            }`}
          >
            Investor
          </button>
        </div>

        {/* Auth Form */}
        <AuthForm mode={mode} role={role} toggleMode={toggleMode} />

        {/* Toggle login/signup */}
        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-[#D0140F] font-medium hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-[#D0140F] font-medium hover:underline cursor-pointer"
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
