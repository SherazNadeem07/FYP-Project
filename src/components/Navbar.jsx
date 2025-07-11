'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const scrollLinks = [
    { label: 'Home', hash: '' },
    { label: 'How It Works', hash: 'work' },
    { label: 'Top Investors', hash: 'investors' },
    { label: 'Popular Pitches', hash: 'popular' },
    { label: 'Why Choose Us', hash: 'choose' },
  ];

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('/')}>
            <FontAwesomeIcon icon={faRocket} className="text-[#D0140F] text-2xl mr-2" />
            <span className="text-xl font-bold text-gray-700 whitespace-nowrap">SharkIdea</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {scrollLinks.map(({ label, hash }) => (
              <button
                key={hash}
                onClick={() => handleNavigate(`/#${hash}`)}
                className={`px-3 py-2 text-sm font-medium transition duration-300 rounded-lg cursor-pointer ${
                  label === 'Home'
                    ? 'bg-[#D0140F] text-white hover:bg-[#3A3A3A]'
                    : 'text-gray-600 hover:text-[#D0140F]'
                }`}
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => handleNavigate('/contact')}
              className="text-gray-600 hover:text-[#D0140F] px-3 py-2 cursor-pointer text-sm font-medium transition duration-300"
            >
              Contact Us
            </button>

            <button
              onClick={() => handleNavigate('/auth')}
              className="text-gray-600 hover:text-[#D0140F] cursor-pointer border-l border-[#3A3A3A] px-3 py-2 text-sm font-medium transition duration-300"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>

            <button
              onClick={() => handleNavigate('/auth')}
              className="bg-[#3A3A3A] hover:bg-[#D0140F] text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-sm"
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-black hover:text-[#D0140F] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-3 pb-4 space-y-2 bg-white shadow-md text-white">
          {scrollLinks.map(({ label, hash }) => (
            <button
              key={hash}
              onClick={() => handleNavigate(`/#${hash}`)}
              className={`block w-full text-left px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition duration-300 ${
                label === 'Home'
                  ? 'bg-[#D0140F] text-white hover:bg-[#3A3A3A]'
                  : 'text-gray-800 hover:text-[#D0140F]'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => handleNavigate('/contact')}
            className="block w-full text-left px-4 py-2 cursor-pointer rounded-md text-sm font-medium text-gray-800 hover:text-[#D0140F] transition duration-300"
          >
            Contact Us
          </button>

          <button
            onClick={() => handleNavigate('/auth')}
            className="block w-full text-left px-4 py-2 cursor-pointer rounded-md text-sm font-medium text-gray-800 hover:text-[#D0140F] transition duration-300"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </button>

          <button
            onClick={() => handleNavigate('/auth')}
            className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium bg-[#3A3A3A] text-white hover:bg-[#D0140F] transition duration-300"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
