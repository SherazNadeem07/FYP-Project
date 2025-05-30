import React from 'react';

export const TrendingPitches = () => {
  return (
    <div id="popular" className="bg-white py-10">
      <div className="max-w-4xl mx-auto p-8">
        {/* Main Heading with accent */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Popular Pitches</h1>
        </div>
        
        {/* Subheading with subtle decoration */}
        <h2 className="text-xl font-semibold text-gray-700 mb-8 px-4 py-2 bg-blue-50 rounded-lg inline-flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          For Enterpreneurs
        </h2>
        
        {/* Two-column bullet points with icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Exposure to Investors.</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Access to funding.</span>
            </li>
          </ul>
          
          {/* Right Column */}
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Access to innovative startups.</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed text-lg">Detailed pitches.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
