'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/Slices/AuthSlice';
import { useRouter } from 'next/navigation';

const AuthForm = ({ mode, role, toggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    title: '',
    bio: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        setError('Full name is required.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'login') {
        const result = await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();
        console.log('loginUser result:', result);

        if (!result.user.role || !['entrepreneur', 'investor'].includes(result.user.role)) {
          console.error('Invalid or missing role:', result.user.role);
          throw new Error('Invalid user role. Please contact support.');
        }

        router.push(
          result.user.role === 'entrepreneur'
            ? '/dashboard/entrepreneur'
            : '/dashboard/investor'
        );
      } else {
        console.log('Sending signup request to:', `${API_BASE_URL}/api/auth/signup`);
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role,
            fullName: formData.fullName,
            title: formData.title,
            bio: formData.bio,
            phone: formData.phone,
            website: formData.website,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
          }),
          credentials: 'include',
        });

        const data = await response.json();
        console.log('Signup API response:', { status: response.status, data });

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        alert('Account created successfully! Please login.');
        toggleMode();
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          title: '',
          bio: '',
          phone: '',
          website: '',
          linkedin: '',
          twitter: '',
        });
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
        <>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title (e.g., Serial Entrepreneur or Investor)"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <textarea
              name="bio"
              placeholder="Bio"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g., +1 (555) 123-4567)"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="url"
              name="website"
              placeholder="Website (e.g., https://yourwebsite.com)"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn (e.g., https://linkedin.com/in/yourprofile)"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.linkedin}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="url"
              name="twitter"
              placeholder="Twitter (e.g., https://twitter.com/yourhandle)"
              className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
              value={formData.twitter}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email *"
          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password *"
          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          value={formData.password}
          onChange={handleInputChange}
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
            name="confirmPassword"
            placeholder="Confirm Password *"
            className="w-full p-2 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#F0F0F0] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
            value={formData.confirmPassword}
            onChange={handleInputChange}
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