'use client';
import React, { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';

export const WhyChooseUs = () => {
  const [scrollDir, setScrollDir] = useState('down');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setScrollDir(window.scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bounceVariant = {
    hidden: { opacity: 0, y: scrollDir === 'down' ? 60 : -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const features = [
    {
      title: 'Launch-Ready for Startups',
      icon: <FaRocket className="text-white text-xl" />,
      color: 'indigo',
      description:
        'Entrepreneurs can pitch, connect, and get funded — all in one intuitive dashboard with zero platform fees.',
    },
    {
      title: 'Built by Founders, for Founders',
      icon: <FaLightbulb className="text-white text-xl" />,
      color: 'purple',
      description:
        'Our team understands real startup pain — because we’re founders too. We built what we wish we had.',
    },
    {
      title: 'Modern Tech Stack',
      icon: <FaGlobe className="text-white text-xl" />,
      color: 'green',
      description:
        'Next.js, Node.js, PostgreSQL, secure auth, real-time updates — everything you expect from a premium platform.',
    },
    {
      title: 'Curated Pitch Access',
      icon: <FaUsers className="text-white text-xl" />,
      color: 'yellow',
      description:
        'Investors get access to curated, screened ideas from early-stage founders with clear value props and market plans.',
    },
    {
      title: 'Verified, Fair, Transparent',
      icon: <FaHandshake className="text-white text-xl" />,
      color: 'red',
      description:
        'All profiles are verified. Every pitch is visible. No hidden fees. Just ethical dealmaking and data-backed profiles.',
    },
    {
      title: 'Built to Scale Together',
      icon: <FaTrophy className="text-white text-xl" />,
      color: 'blue',
      description:
        'SharkIdea evolves with you. Today you fund a pitch — tomorrow you co-lead a pre-seed round. Let’s scale ideas together.',
    },
  ];

  return (
    <div id="choose">
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
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={bounceVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className={`bg-${feature.color}-50 p-8 rounded-2xl shadow-md border border-${feature.color}-200 group hover:shadow-xl transition`}
            >
              <div
                className={`w-14 h-14 bg-${feature.color}-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition`}
              >
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold text-${feature.color}-900 mb-3`}>
                {feature.title}
              </h3>
              <p className={`text-${feature.color}-700`}>{feature.description}</p>
            </motion.div>
          ))}
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
