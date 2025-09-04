
'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function PitchesPage() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || token;
    console.log('PitchesPage - Token check - localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing', 'Redux:', token ? 'Present' : 'Missing');
    
    if (!storedToken) {
      console.log('No token found, redirecting to login');
      router.push('/auth');
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
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Pitches fetch error:', response.status, errorText);
          throw new Error(`Failed to fetch pitches: ${errorText}`);
        }

        const data = await response.json();
        setPitches(data.pitches || []);
      } catch (err) {
        console.error('Error fetching pitches:', err.message);
        setError(err.message || 'Failed to load pitches');
        if (err.message.includes('No token found') || err.message.includes('Invalid token')) {
          router.push('/auth');
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
        <p className="text-red-400">{error}</p>
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
