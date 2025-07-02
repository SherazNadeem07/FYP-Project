'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const scrollLinks = [
    { label: "Home", hash: "" },
    { label: "How It Works", hash: "work" },
    { label: "Top Investors", hash: "investors" },
    { label: "Popular Pitches", hash: "popular" },
    { label: "Why Choose Us", hash: "choose" }
  ];

  // Hide Navbar if user is on dashboard route
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigate('/')}>
              <FontAwesomeIcon
                icon={faRocket}
                className="text-indigo-900 text-2xl mr-2"
              />
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                SharkIdea
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {scrollLinks.map(({ label, hash }) => (
              <button
                key={hash}
                onClick={() => handleNavigate(`/#${hash}`)}
                className={`${
                  label === "Home"
                    ? "text-white bg-indigo-900 rounded-lg hover:bg-indigo-800"
                    : "text-gray-800 hover:text-indigo-700"
                } px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap`}
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => handleNavigate('/contact')}
              className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap"
            >
              Contact Us
            </button>

            {/* Auth Buttons */}
            <button
              onClick={() => handleNavigate('/auth')}
              className="text-gray-600 hover:text-indigo-700 border-l border-gray-300 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>
            <button
              onClick={() => handleNavigate('/auth')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-sm whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FontAwesomeIcon
                icon={mobileMenuOpen ? faTimes : faBars}
                className="text-xl"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {scrollLinks.map(({ label, hash }) => (
            <button
              key={hash}
              onClick={() => handleNavigate(`/#${hash}`)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50"
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => handleNavigate('/contact')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50"
          >
            Contact Us
          </button>
          <button
            onClick={() => handleNavigate('/auth')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </button>
          <button
            onClick={() => handleNavigate('/auth')}
            className="block mt-2 w-full text-left px-3 py-2 rounded-md text-base font-medium bg-amber-500 text-white hover:bg-amber-600"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
