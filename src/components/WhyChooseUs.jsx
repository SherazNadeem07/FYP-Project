import React from 'react';
import { FaChartLine, FaLightbulb, FaHandshake, FaMoneyBillWave, FaGlobe, FaUsers, FaTrophy } from 'react-icons/fa';

export const WhyChooseUs = () => {
  return (
    <>   
    <div id='choose'>
     <div className="max-w-6xl mx-auto px-6 py-16 bg-gray-50">
      {/* Header */}
      <div  className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Why Choose PitchVerse
          </span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          More than a final year project — this is a student-built startup revolutionizing how ideas meet investments. Here's why PitchVerse is your next big bet.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* 1 - Vision */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition duration-300">
            <FaLightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Student-Built, Vision-Driven</h3>
          <p className="text-gray-600 leading-relaxed">
            Created by final-year students passionate about solving real-world startup struggles — not just a grade, but a mission.
          </p>
          <div className="mt-4 text-blue-600 font-medium italic">"This is innovation at its roots."</div>
        </div>

        {/* 2 - Problem Solving */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-6 group-hover:-rotate-6 transition duration-300">
            <FaChartLine className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Solving the Pitch Gap</h3>
          <p className="text-gray-600 leading-relaxed">
            Startups often fail due to lack of exposure — we connect raw ideas with real investors through an interactive, transparent, and gamified platform.
          </p>
          <div className="mt-4 text-purple-600 font-medium italic">"Built to pitch. Built to win."</div>
        </div>

        {/* 3 - Credible UI/UX */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-100 hover:border-green-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition duration-300">
            <FaGlobe className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Polished Product Experience</h3>
          <p className="text-gray-600 leading-relaxed">
            Built with modern tech (Next.js, Node.js, PostgreSQL), our platform delivers seamless user experience and credibility from first click to final pitch.
          </p>
          <div className="mt-4 text-green-600 font-medium italic">"Doesn't feel like a student project — because it's not."</div>
        </div>

        {/* 4 - Community Focused */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-yellow-100 hover:border-yellow-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mb-6 group-hover:-rotate-6 transition duration-300">
            <FaUsers className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Built for the Underdogs</h3>
          <p className="text-gray-600 leading-relaxed">
            PitchVerse gives a voice to student founders and early-stage entrepreneurs often ignored by big platforms.
          </p>
          <div className="mt-4 text-yellow-600 font-medium italic">"We back the ones nobody notices — yet."</div>
        </div>

        {/* 5 - Scalable Vision */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition duration-300">
            <FaTrophy className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Scalable by Design</h3>
          <p className="text-gray-600 leading-relaxed">
            Designed to grow with incubators, universities, and investor circles. Today a project — tomorrow a platform.
          </p>
          <div className="mt-4 text-red-600 font-medium italic">"This can go national — even global."</div>
        </div>

        {/* 6 - Fair Dealings */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mb-6 group-hover:-rotate-6 transition duration-300">
            <FaHandshake className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent & Fair</h3>
          <p className="text-gray-600 leading-relaxed">
            Built with ethics in mind — zero commission, equal visibility for every pitch, and verified investor profiles.
          </p>
          <div className="mt-4 text-indigo-600 font-medium italic">"A win-win for founders and funders."</div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto">
          <FaMoneyBillWave className="mr-2" />
          Join the Pitch Revolution
        </button>
      </div>
    </div>
    </div>
    </>
  );
};
