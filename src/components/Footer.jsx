import React from 'react';

const Footer = () => {
return (
     <footer className="bg-gradient-to-b from-[#1E1E3F] to-[#14142B] border-t border-gray-200 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left text-white">
            <h3 className="text-3xl font-bold mb-2 text-white">Ready to Pitch Your Idea?</h3>
            <p className="text-white text-2xl">Join Now </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-white hover:bg-blue-700 text-black font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md">
              Signup for Enterpreneur
            </button>
            <button className="px-6 py-3 border border-gray-300 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md">
             Join Now
            </button>
          </div>
        </div>
        <div className=" mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SharkIdea. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
