'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturesData } from '../Redux/Slices/featureCardSlice';
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <section id="investors" className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Top Investors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-indigo-400 transition cursor-pointer"
            onClick={() => handleViewPitch(card)}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500"
            />
            <h3 className="text-xl font-bold text-center text-indigo-700">{card.title}</h3>
            <p className="text-center text-sm text-gray-500 mb-1">{card.sector}</p>
            <p className="text-center text-gray-600 mb-2">{card.amount}</p>
            <p className="text-gray-500 text-sm text-center">{card.items}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
