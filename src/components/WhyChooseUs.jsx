'use client';
import React from 'react';
import Link from 'next/link';
import {
  FaChartLine,
  FaLightbulb,
  FaHandshake,
  FaMoneyBillWave,
  FaGlobe,
  FaUsers,
  FaTrophy,
  FaRocket
} from 'react-icons/fa';

export const WhyChooseUs = () => {
  return (
    <div id='choose'>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600">
              Why Choose SharkIdea
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto tracking-wide">
            SharkIdea isn't just a final year project — it's a next-gen platform built to connect bold ideas with visionary investors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Entrepreneur-Focused Features */}
          <div className="bg-indigo-50 p-8 rounded-2xl shadow-md border border-indigo-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaRocket className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Launch-Ready for Startups</h3>
            <p className="text-indigo-700">Entrepreneurs can pitch, connect, and get funded — all in one intuitive dashboard with zero platform fees.</p>
          </div>

          <div className="bg-purple-50 p-8 rounded-2xl shadow-md border border-purple-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaLightbulb className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Built by Founders, for Founders</h3>
            <p className="text-purple-700">Our team understands real startup pain — because we’re founders too. We built what we wish we had.</p>
          </div>

          <div className="bg-green-50 p-8 rounded-2xl shadow-md border border-green-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaGlobe className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-3">Modern Tech Stack</h3>
            <p className="text-green-700">Next.js, Node.js, PostgreSQL, secure auth, real-time updates — everything you expect from a premium platform.</p>
          </div>

          {/* Investor-Focused Features */}
          <div className="bg-yellow-50 p-8 rounded-2xl shadow-md border border-yellow-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaUsers className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-900 mb-3">Curated Pitch Access</h3>
            <p className="text-yellow-700">Investors get access to curated, screened ideas from early-stage founders with clear value props and market plans.</p>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl shadow-md border border-red-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaHandshake className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-3">Verified, Fair, Transparent</h3>
            <p className="text-red-700">All profiles are verified. Every pitch is visible. No hidden fees. Just ethical dealmaking and data-backed profiles.</p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-200 group hover:shadow-xl transition">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <FaTrophy className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Built to Scale Together</h3>
            <p className="text-blue-700">SharkIdea evolves with you. Today you fund a pitch — tomorrow you co-lead a pre-seed round. Let’s scale ideas together.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/auth">
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 hover:from-indigo-800 hover:via-purple-800 hover:to-pink-700 text-white font-extrabold rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
              <FaMoneyBillWave className="mr-3 text-white" />
              Join the Pitch Revolution
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
