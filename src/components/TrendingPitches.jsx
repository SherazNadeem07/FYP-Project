'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TrendingPitches = () => {
  const [scrollDir, setScrollDir] = useState('down');

  useEffect(() => {
    let lastY = window.scrollY;
    const updateScrollDir = () => {
      const currentY = window.scrollY;
      setScrollDir(currentY > lastY ? 'down' : 'up');
      lastY = currentY;
    };
    window.addEventListener('scroll', updateScrollDir);
    return () => window.removeEventListener('scroll', updateScrollDir);
  }, []);

  const variantsLeft = {
    hidden: { opacity: 0, x: scrollDir === 'down' ? -80 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const variantsRight = {
    hidden: { opacity: 0, x: scrollDir === 'down' ? 80 : -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div id="popular" className="bg-white py-10">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Popular Pitches</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-8 px-4 py-2 bg-blue-50 rounded-lg inline-flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          For Enterpreneurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={variantsLeft}
            className="space-y-6"
          >
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Exposure to Investors.</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Access to funding.</span>
            </li>
          </motion.ul>

          {/* Right Column */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={variantsRight}
            className="space-y-6"
          >
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Access to innovative startups.</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Detailed pitches.</span>
            </li>
          </motion.ul>
        </div>
      </div>
    </div>
  );
};
