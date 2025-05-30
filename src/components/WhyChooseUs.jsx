import React from 'react';
import { FaChartLine, FaLightbulb, FaHandshake, FaMoneyBillWave, FaGlobe, FaUsers, FaTrophy } from 'react-icons/fa';

export const WhyChooseUs = () => {
  return (
    <div id='choose'>
      <div className="max-w-6xl mx-auto px-6 py-16 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600">
              Why Choose SharkIdea
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto tracking-wide">
            More than a final year project — this is a student-built startup revolutionizing how ideas meet investments. Here's why sharkIdea is your next big bet.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* 1 - Vision */}
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-8 rounded-2xl shadow-md border border-indigo-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaLightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Student-Built, Vision-Driven</h3>
            <p className="text-indigo-700 leading-relaxed">
              Created by final-year students passionate about solving real-world startup struggles — not just a grade, but a mission.
            </p>
            <div className="mt-4 text-indigo-600 font-medium italic">"This is innovation at its roots."</div>
          </div>

          {/* 2 - Problem Solving */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 rounded-2xl shadow-md border border-purple-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaChartLine className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Solving the Pitch Gap</h3>
            <p className="text-purple-700 leading-relaxed">
              Startups often fail due to lack of exposure — we connect raw ideas with real investors through an interactive, transparent, and gamified platform.
            </p>
            <div className="mt-4 text-purple-600 font-medium italic">"Built to pitch. Built to win."</div>
          </div>

          {/* 3 - Credible UI/UX */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-8 rounded-2xl shadow-md border border-green-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaGlobe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-3">Polished Product Experience</h3>
            <p className="text-green-700 leading-relaxed">
              Built with modern tech (Next.js, Node.js, PostgreSQL), our platform delivers seamless user experience and credibility from first click to final pitch.
            </p>
            <div className="mt-4 text-green-600 font-medium italic">"Doesn't feel like a student project — because it's not."</div>
          </div>

          {/* 4 - Community Focused */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-8 rounded-2xl shadow-md border border-yellow-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-900 mb-3">Built for the Underdogs</h3>
            <p className="text-yellow-700 leading-relaxed">
              sharkIdea gives a voice to student founders and early-stage entrepreneurs often ignored by big platforms.
            </p>
            <div className="mt-4 text-yellow-600 font-medium italic">"We back the ones nobody notices — yet."</div>
          </div>

          {/* 5 - Scalable Vision */}
          <div className="bg-gradient-to-br from-red-100 to-red-50 p-8 rounded-2xl shadow-md border border-red-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaTrophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-3">Scalable by Design</h3>
            <p className="text-red-700 leading-relaxed">
              Designed to grow with incubators, universities, and investor circles. Today a project — tomorrow a platform.
            </p>
            <div className="mt-4 text-red-600 font-medium italic">"This can go national — even global."</div>
          </div>

          {/* 6 - Fair Dealings */}
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-8 rounded-2xl shadow-md border border-indigo-200 hover:shadow-xl transition duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transform transition duration-300">
              <FaHandshake className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Transparent & Fair</h3>
            <p className="text-indigo-700 leading-relaxed">
              Built with ethics in mind — zero commission, equal visibility for every pitch, and verified investor profiles.
            </p>
            <div className="mt-4 text-indigo-600 font-medium italic">"A win-win for founders and funders."</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 hover:from-indigo-800 hover:via-purple-800 hover:to-pink-700 text-white font-extrabold rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
            <FaMoneyBillWave className="mr-3 text-white" />
            Join the Pitch Revolution
          </button>
        </div>
      </div>
    </div>
  );
};
