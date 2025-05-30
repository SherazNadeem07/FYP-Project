'use client';
import React, { useState } from "react";
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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FontAwesomeIcon 
                icon={faRocket} 
                className="text-indigo-900 text-2xl mr-2" 
                style={{ width: '1em', height: '1em' }}
              />
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                SharkIdea
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              Home
            </a>
            <a href="#work" className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              How It Works
            </a>
            <a href="#feature" className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              Features
            </a>
            <a href="#popular" className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              Popular Pitchres
            </a>
            <a href="#choose" className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              Why Choose Us
            </a>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <a href="#" className="text-gray-600 hover:text-indigo-700 border-l border-gray-300 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
                <FontAwesomeIcon 
                  icon={faSignInAlt} 
                  className="mr-2"
                  style={{ width: '1em', height: '1em' }}
                /> 
                Login
              </a>
              <a href="#" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-sm whitespace-nowrap">
                <FontAwesomeIcon 
                  icon={faUserPlus} 
                  className="mr-2"
                  style={{ width: '1em', height: '1em' }}
                /> 
                Sign Up
              </a>
            </div>
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
                style={{ width: '1em', height: '1em' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50">
            Home
          </a>
          <a href="#work" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50">
            How It Works
          </a>
          <a href="#feature" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50">
           Features
          </a>
          <a href="#popular" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50">
            Popular Pitches
          </a>
          <a href="#choose" className="text-gray-800 hover:text-indigo-700 px-3 py-2 text-sm font-medium transition duration-300 whitespace-nowrap">
              Why Choose Us
            </a>
          <div className="pt-4 border-t border-gray-200">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50">
              <FontAwesomeIcon 
                icon={faSignInAlt} 
                className="mr-2"
                style={{ width: '1em', height: '1em' }}
              /> 
              Login
            </a>
            <a href="#" className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-amber-500 text-white hover:bg-amber-600">
              <FontAwesomeIcon 
                icon={faUserPlus} 
                className="mr-2"
                style={{ width: '1em', height: '1em' }}
              /> 
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
