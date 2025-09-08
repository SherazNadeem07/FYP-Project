'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function PitchesPage() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getCookie('token') || token;
    console.log('PitchesPage - Token check - Cookie:', getCookie('token') ? 'Present' : 'Missing', 'Redux:', token ? 'Present' : 'Missing');

    if (!storedToken) {
      console.log('No token found, redirecting to login');
      setError('Please log in to view your pitches.');
      setLoading(false);
      return;
    }

    const fetchPitches = async () => {
      try {
        console.log('Fetching pitches with token:', storedToken ? 'Present' : 'Missing');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Pitches fetch error:', response.status, errorData);
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPitches(data.pitches || []);
      } catch (err) {
        console.error('Error fetching pitches:', err.message);
        if (err.message.includes('Invalid or expired token') || err.message.includes('401') || err.message.includes('403')) {
          setError('Your session has expired. Please log in again.');
          // Optionally clear the invalid token
          // deleteCookie('token'); // Uncomment if you want to clear the cookie
          setTimeout(() => {
            router.push('/auth');
          }, 2000);
        } else {
          setError(err.message || 'Failed to load pitches');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [router, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] text-[#E8E8E8]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] text-[#E8E8E8]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-[#D0140F] hover:bg-[#B0100D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2C2C] px-4 py-6 sm:px-6 md:px-10 rounded-lg shadow-sm text-[#E8E8E8]">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Your Pitches</h1>

      {pitches.length === 0 ? (
        <p className="text-[#9ca3af] text-center py-8">No pitches found. Create a pitch in the dashboard!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="border border-[#3F3F3F] bg-[#383838] rounded-lg p-4">
              <h2 className="text-base sm:text-lg font-semibold text-white">{pitch.name}</h2>
              <p className="text-[#9ca3af] text-sm sm:text-base">
                Status:{' '}
                <span
                  className={
                    pitch.status === 'Pending'
                      ? 'text-yellow-400'
                      : pitch.status === 'Live'
                      ? 'text-green-400'
                      : pitch.status === 'Funded'
                      ? 'text-blue-400'
                      : 'text-red-400'
                  }
                >
                  {pitch.status}
                </span>
              </p>
              <p className="text-[#9ca3af] text-sm sm:text-base">
                Funding Goal: <span className="text-[#E8E8E8]">${pitch.fundingGoal.toLocaleString()}</span>
              </p>
              <p className="text-[#9ca3af] text-sm sm:text-base">
                Equity Offered: <span className="text-[#E8E8E8]">{pitch.equityOffered}%</span>
              </p>
              <p className="text-[#9ca3af] text-sm sm:text-base">
                Submitted: <span className="text-[#E8E8E8]">{new Date(pitch.dateSubmitted).toLocaleDateString()}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}