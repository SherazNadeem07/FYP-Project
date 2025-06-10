'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturesData } from '../Redux/Slices/featureCardSlice';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const FeaturesSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cards, loading, error } = useSelector((state) => state.features);

  useEffect(() => {
    dispatch(fetchFeaturesData());
  }, [dispatch]);

  const handleViewPitch = (card) => {
    router.push(`/features/${card.id}`);
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div id="feature" className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Features</h1>

      {/* Bullet points */}
      <div className="flex justify-between mb-6 flex-wrap gap-4">
        <div className="w-full sm:w-[48%]">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Investor & Enterpreneur Dashboard</li>
            <li>Video Pitch Upload</li>
            <li>Funding Request & Offer System</li>
          </ul>
        </div>
        <div className="w-full sm:w-[48%]">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Pitch Events</li>
            <li>Secure Messaging</li>
          </ul>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards?.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3 mb-2">
              <FaUserCircle className="text-indigo-600 text-2xl" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
            </div>

            <p className="text-indigo-500 text-lg font-semibold mb-4">{card.amount}</p>
            <p className="text-gray-600 mb-6 line-clamp-3">{card.items}</p>
            <button
              onClick={() => handleViewPitch(card)}
              aria-label={`View pitch for ${card.title}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded transition-colors duration-300"
            >
              View Pitch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;