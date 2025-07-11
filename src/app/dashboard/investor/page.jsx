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
    setSelectedPitch(null);
    setInvestmentAmount('');
    setMessage('');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8  text-[#F0F0F0] overflow-x-hidden">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Investor Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map(pitch => (
          <div key={pitch.id} className="bg-[#252525] p-5 sm:p-6 rounded-lg border border-[#3A3A3A] shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-white">{pitch.title}</h2>
            <p className="text-[#AAAAAA] mb-4 text-sm sm:text-base">{pitch.description}</p>

            <div className="flex justify-between mb-3 text-sm">
              <div className="flex items-center text-[#DDDDDD]">
                <FiDollarSign className="mr-1 text-[#D0140F]" />
                <span>{pitch.fundingGoal}</span>
              </div>
              <div className="flex items-center text-[#DDDDDD]">
                <FiPercent className="mr-1 text-[#D0140F]" />
                <span>{pitch.equityOffered}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 text-xs sm:text-sm">
              <span className="text-[#888888]">By {pitch.entrepreneur}</span>
              <span className="px-2 py-1 rounded-full border border-[#00FFA3] text-[#00FFA3] bg-[#2A2A2A]">
                {pitch.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-4">
              <button 
                onClick={() => handleInvest(pitch.id)}
                className="bg-[#D0140F] text-white px-4 py-2 rounded-lg hover:bg-[#B0100D] text-sm w-full sm:w-auto"
              >
                View Pitch
              </button>
              <div className="flex items-center justify-center sm:justify-end gap-3 text-sm text-[#AAAAAA]">
                <span className="flex items-center"><FiEye className="mr-1" />124</span>
                <span className="flex items-center"><FiMessageSquare className="mr-1" />{pitch.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] text-[#F0F0F0] rounded-lg p-4 sm:p-6 w-full max-w-md border border-[#3A3A3A]">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Invest in {selectedPitch.title}</h2>

            <form onSubmit={submitInvestment}>
              <div className="mb-4">
                <label className="block text-[#AAAAAA] mb-2 text-sm">Investment Amount ($)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full p-2 bg-[#2A2A2A] text-[#F0F0F0] border border-[#3A3A3A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#AAAAAA] mb-2 text-sm">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 bg-[#2A2A2A] text-[#F0F0F0] border border-[#3A3A3A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
                  rows="3"
                  placeholder="Add a message to the entrepreneur"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPitch(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-[#3A3A3A] rounded-lg text-[#F0F0F0] bg-[#252525] hover:bg-[#2A2A2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-[#D0140F] text-white rounded-lg hover:bg-[#B0100D]"
                >
                  Submit Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Other Pages */}
      <div className="space-y-12">
        <InvestmentsPage />
        <AnalyticsPage />
      </div>
    </div>
  );
}
