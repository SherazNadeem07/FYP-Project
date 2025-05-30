import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About / Mission */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">PitchVerse</h3>
          <p className="text-sm">
            A student-powered platform connecting groundbreaking startup ideas with visionary investors. 
            Where innovation meets opportunity.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/why-choose-us" className="hover:text-white transition">Why Choose Us</a></li>
            <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Connect with Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-300 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
            <a href="mailto:hello@pitchverse.com" className="hover:text-yellow-400 transition"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PitchVerse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
