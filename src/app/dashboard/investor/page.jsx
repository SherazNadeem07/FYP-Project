'use client';
import { useState } from 'react';
import { FiDollarSign, FiPercent, FiEye, FiMessageSquare } from 'react-icons/fi';
import AnalyticsPage from './analytics/page';
import InvestmentsPage from './investments/page';

export default function InvestorDashboard() {
  const [pitches, setPitches] = useState([
    {
      id: 1,
      title: "Fitness Tracker Device",
      description: "A revolutionary fitness tracker with advanced health monitoring capabilities",
      fundingGoal: "$100,000",
      equityOffered: "15%",
      entrepreneur: "John Doe",
      status: "Live",
      comments: 5
    },
    {
      id: 2,
      title: "Green Energy Solutions",
      description: "Sustainable energy solutions for urban environments",
      fundingGoal: "$250,000",
      equityOffered: "20%",
      entrepreneur: "Sarah Smith",
      status: "Live",
      comments: 8
    },
    {
      id: 3,
      title: "AI Marketing Platform",
      description: "AI-powered marketing automation for small businesses",
      fundingGoal: "$150,000",
      equityOffered: "10%",
      entrepreneur: "Mike Johnson",
      status: "Live",
      comments: 3
    }
  ]);

  const [selectedPitch, setSelectedPitch] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleInvest = (pitchId) => {
    const pitch = pitches.find(p => p.id === pitchId);
    setSelectedPitch(pitch);
  };

  const submitInvestment = (e) => {
    e.preventDefault();
    console.log(`Investing $${investmentAmount} in ${selectedPitch.title}`);
    // API call would go here
    setSelectedPitch(null);
    setInvestmentAmount('');
  };

  return (
    <>
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Discover Pitches</h1>
      
      {/* Pitches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map(pitch => (
          <div key={pitch.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-2">{pitch.title}</h2>
            <p className="text-gray-600 mb-4">{pitch.description}</p>
            
            <div className="flex justify-between mb-3">
              <div className="flex items-center text-gray-700">
                <FiDollarSign className="mr-1" />
                <span>{pitch.fundingGoal}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FiPercent className="mr-1" />
                <span>{pitch.equityOffered}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">By {pitch.entrepreneur}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                pitch.status === 'Live' ? 'bg-green-100 text-green-800' : 
                pitch.status === 'Funded' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {pitch.status}
              </span>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => handleInvest(pitch.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Pitch
              </button>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-gray-500 text-sm">
                  <FiEye className="mr-1" /> 124
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <FiMessageSquare className="mr-1" /> {pitch.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Invest in {selectedPitch.title}</h2>
            
            <form onSubmit={submitInvestment}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Investment Amount ($)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  placeholder="Add a message to the entrepreneur"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedPitch(null)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    <InvestmentsPage/>
    <AnalyticsPage/>
    </>
  );
}