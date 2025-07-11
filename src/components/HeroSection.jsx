'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

export default function Content() {
  const router = useRouter();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      setScale(scrollingDown ? 0.95 : 1); // zoom out on scroll down, zoom in on scroll up
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartJourney = () => router.push('/entrepreneurs');
  const handleBecomeInvestor = () => router.push('/auth');

  return (
    <section
      className="bg-white text-gray-900 py-20 transition-transform duration-500 ease-in-out"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="container mx-auto px-6 lg:px-16 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Pitch your dream, <span className="text-[#D0140F]">Build the future</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-md">
            Join the platform where ambitious pitchers meet serious investors. Get the funding,
            mentorship, and exposure your startup needs to succeed.
          </p>
          <div className="flex justify-start">
            <button
              onClick={handleStartJourney}
              className="cursor-pointer inline-flex text-white bg-indigo-700 hover:bg-[#D0140F] hover:text-white border-0 py-3 px-8 focus:outline-none rounded-lg text-lg font-semibold shadow-lg transition duration-300"
            >
              Start Your Journey
            </button>
            <button
              onClick={handleBecomeInvestor}
              className="cursor-pointer ml-4 inline-flex text-indigo-700 bg-indigo-100 hover:bg-[#D0140F] hover:text-white border-0 py-3 px-8 focus:outline-none rounded-lg text-lg font-semibold shadow-md transition duration-300"
            >
              Become an Investor
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-700">
            <div>
              <h3 className="text-xl font-bold text-[#D0140F]">75.2%</h3>
              <p>Average daily activity</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#D0140F]">~20k</h3>
              <p>Average daily users</p>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-500 mr-2">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <FaStar className="text-gray-300" />
              </div>
              <span className="text-gray-800 font-medium">4.5</span>
              <p className="ml-2 text-gray-600">Average user rating</p>
            </div>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <img
            src="/Business.png"
            alt="3D UI Design"
            className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
