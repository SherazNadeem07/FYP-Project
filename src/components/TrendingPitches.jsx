import React from 'react';

export const TrendingPitches = () => {
  return (
    <>
    <div id='popular'>
    <div className="max-w-4xl mx-auto p-8">
      {/* Main Heading with accent */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Popular Pitches</h1>
      </div>
      
      {/* Subheading with subtle decoration */}
      <h2 className="text-xl font-semibold text-gray-700 mb-8 px-3 py-2 bg-gray-50 rounded-lg inline-flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        For Entergorgers
      </h2>
      
      {/* Two-column bullet points with icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <ul className="space-y-5">
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 leading-relaxed">Exposure to Investors.</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 leading-relaxed">Access to funding.</span>
          </li>
        </ul>
        
        {/* Right Column */}
        <ul className="space-y-5">
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 leading-relaxed">Access to innovative startups.</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 leading-relaxed">Detailed pitches.</span>
          </li>
        </ul>
      </div>
    </div>
    </div>
    </>
  );
};