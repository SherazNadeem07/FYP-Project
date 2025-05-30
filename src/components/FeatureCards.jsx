'use client'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturesData } from '../Redux/Slices/featureCardSlice';

const FeaturesSection = () => {
  const dispatch = useDispatch();
  const { cards, loading, error } = useSelector((state) => state.features);

  useEffect(() => {
    dispatch(fetchFeaturesData());
  }, [dispatch]);

  return (
    <>
    <div id='feature'>
    <div  className="max-w-6xl mx-auto px-4 py-8">
      <h1  className="text-3xl font-bold text-gray-800 mb-8">Features</h1>
      
      {/* Bullet points section */}
      <div className="flex justify-between mb-6">
        <div className="w-[48%]">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Inserted & Enterpreneur Dashboard</li>
            <li>Video Pitch Upload</li>
            <li>Funding Request & Offer System</li>
          </ul>
        </div>
        <div className="w-[48%]">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Pitch Events</li>
            <li>Secure Messaging</li>
          </ul>
        </div>
      </div>
      
      {/* Cards section */}
      {loading && <p className="text-center py-4 text-gray-600">Loading...</p>}
      {error && <p className="text-center py-4 text-red-500">Error: {error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-blue-500 text-lg font-medium mb-4">{card.amount}</p>
            <p className="text-gray-600 mb-4">{card.items}</p>
            <button className=" hover:bg-blue-600 border border-gray-400 cursor-pointer text-black font-medium py-2 px-4 rounded transition-colors">
              View Pitch
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default FeaturesSection;