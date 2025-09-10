'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from 'cookies-next';
import { FiDollarSign, FiPercent, FiEye, FiMessageSquare, FiXCircle } from 'react-icons/fi';
import AnalyticsPage from './analytics/page';
import InvestmentsPage from './investments/page';
import { setCredentials, verifyToken } from '../../../Redux/Slices/AuthSlice';

export default function InvestorDashboard() {
  const [pitches, setPitches] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [userInvestments, setUserInvestments] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsClient(true);
    let storedToken = token || getCookie('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    console.log('Token check - Cookie:', getCookie('token') ? 'Present' : 'Missing', 'Redux:', token ? 'Present' : 'Missing', 'LocalStorage:', storedToken ? 'Present' : 'Missing');
    
    if (storedToken && !token && typeof window !== 'undefined') {
      dispatch(setCredentials({ token: storedToken }));
    }

    if (!storedToken && isClient) {
      console.log('No token found, redirecting to login');
      router.push('/auth');
      return;
    }
    if (storedToken) {
      fetchPitches(storedToken);
      fetchUserInvestments(storedToken);
    }
  }, [router, token, isClient]);

  const fetchPitches = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/investor/pitches`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pitches');
      }

      const data = await response.json();
      console.log('Pitches response:', data);
      setPitches(data.pitches || []);
    } catch (error) {
      console.error('Error fetching pitches:', error.message);
      alert(`Error fetching pitches: ${error.message}`);
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        router.push('/auth');
      }
      setPitches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInvestments = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/investor/investments`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch investments');
      }

      const data = await response.json();
      const investmentMap = {};
      data.investments.forEach((inv) => {
        investmentMap[inv.pitch_id] = { id: inv.id, status: inv.status };
      });
      setUserInvestments(investmentMap);
    } catch (error) {
      console.error('Error fetching user investments:', error.message);
      alert(`Error fetching investments: ${error.message}`);
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        router.push('/auth');
      }
    }
  };

  const handleInvest = (pitch) => {
    setSelectedPitch(pitch);
  };

  const handleRejectPitch = async (pitchId) => {
    if (!confirm('Are you sure you want to reject this pitch? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/investor/pitches/${pitchId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: message || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject pitch');
      }

      alert('Pitch rejected successfully!');
      fetchPitches(authToken);
      fetchUserInvestments(authToken);
      window.dispatchEvent(new Event('refreshInvestments'));
    } catch (error) {
      console.error('Error rejecting pitch:', error.message);
      alert(`Failed to reject pitch: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        router.push('/auth');
      }
    }
  };

  const submitInvestment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/investor/invest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          pitchId: selectedPitch.id,
          amount,
          message: message || null,
        }),
      });

      if (response.ok) {
        alert('Investment submitted successfully.');
        setSelectedPitch(null);
        setInvestmentAmount('');
        setMessage('');
        fetchPitches(authToken);
        fetchUserInvestments(authToken);
        window.dispatchEvent(new Event('refreshInvestments'));
      } else {
        const errorData = await response.json();
        alert(`Failed to submit investment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting investment:', error.message);
      alert(`Error submitting investment: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        router.push('/auth');
      }
    }
  };

  if (!isClient || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 text-[#F0F0F0] overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Investor Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {pitches.length === 0 ? (
          <p className="text-[#AAAAAA] col-span-full text-center py-8">No pitches available.</p>
        ) : (
          pitches.map((pitch) => (
            <div key={pitch.id} className="bg-[#252525] p-5 sm:p-6 rounded-lg border border-[#3A3A3A] shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-white">{pitch.title}</h2>
              <p className="text-[#AAAAAA] mb-4 text-sm sm:text-base">{pitch.description}</p>

              <div className="flex justify-between mb-3 text-sm">
                <div className="flex items-center text-[#DDDDDD]">
                  <FiDollarSign className="mr-1 text-[#D0140F]" />
                  <span>${(pitch.fundingGoal || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-[#DDDDDD]">
                  <FiPercent className="mr-1 text-[#D0140F]" />
                  <span>{(pitch.equityOffered || 0)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 text-xs sm:text-sm">
                <span className="text-[#888888]">By {pitch.entrepreneur}</span>
                <span className={`px-2 py-1 rounded-full border 
                  ${pitch.status === 'Live' ? 'border-[#00FFA3] text-[#00FFA3]' : 
                    pitch.status === 'Rejected' ? 'border-[#D0140F] text-[#D0140F]' : 
                    'border-[#FFB800] text-[#FFB800]'}
                  bg-[#2A2A2A]`}>
                  {pitch.status}
                </span>
              </div>

              <div className="space-y-2">
                <p><strong>Industry:</strong> {pitch.industry || 'Not set'}</p>
                <p><strong>Business Model:</strong> {pitch.businessModel || 'Not set'}</p>
                <p><strong>Team Size:</strong> {pitch.teamSize || 'Not set'}</p>
                <p><strong>Founded Year:</strong> {pitch.foundedYear || 'Not set'}</p>
                <p><strong>Location:</strong> {pitch.location || 'Not set'}</p>
                <p><strong>Revenue:</strong> {pitch.revenue ? `$${pitch.revenue.toLocaleString()}` : 'Not set'}</p>
                {pitch.pitchDocUrl && (
                  <p><strong>Pitch Document:</strong> <a href={pitch.pitchDocUrl} target="_blank" className="text-[#D0140F] hover:underline">View Document</a></p>
                )}
                {pitch.pitchVideoUrl && (
                  <p><strong>Pitch Video:</strong> <a href={pitch.pitchVideoUrl} target="_blank" className="text-[#D0140F] hover:underline">View Video</a></p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-4">
                {userInvestments[pitch.id] ? (
                  <div className="text-[#AAAAAA] text-sm">
                    {userInvestments[pitch.id].status === 'Pending' ? (
                      <span>Investment Pending</span>
                    ) : userInvestments[pitch.id].status === 'Accepted' ? (
                      <span>Investment Accepted</span>
                    ) : (
                      <span>Pitch Rejected</span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={() => handleInvest(pitch)}
                      className="bg-[#D0140F] text-white px-4 py-2 rounded-lg hover:bg-[#B0100D] text-sm w-full sm:w-auto"
                    >
                      Invest Now
                    </button>
                    <button 
                      onClick={() => handleRejectPitch(pitch.id)}
                      className="bg-[#3A3A3A] text-[#D0140F] px-4 py-2 rounded-lg hover:bg-[#2A2A2A] text-sm w-full sm:w-auto flex items-center justify-center"
                    >
                      <FiXCircle className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-end gap-3 text-sm text-[#AAAAAA]">
                  <span className="flex items-center"><FiEye className="mr-1" />{pitch.investorCount}</span>
                  <span className="flex items-center"><FiMessageSquare className="mr-1" />0</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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

      <div className="space-y-12 mt-8">
        <InvestmentsPage />
        <AnalyticsPage />
      </div>
    </div>
  );
}