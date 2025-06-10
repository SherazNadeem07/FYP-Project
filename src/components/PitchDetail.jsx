'use client';
import React from 'react';
import Link from 'next/link';
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const PitchDetail = ({ card }) => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Features
      </button>

      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-start mb-6">
          <FaUserCircle className="text-indigo-600 text-4xl mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{card.title}</h1>
            <p className="text-indigo-500 text-xl font-semibold mt-2">{card.amount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pitch Details</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{card.items}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Additional Information</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Pitch</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Video Pitch would be available
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Investment Terms</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Equity: 10-15%</li>
                <li>Valuation: ${card.amount}</li>
                <li>Investment Stage: Seed Round</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
         <Link href='/auth'>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded transition-colors duration-300">
            Contact Entrepreneur
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PitchDetail;