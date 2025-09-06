'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiUpload, FiDollarSign, FiPercent, FiBriefcase, FiUsers, FiClock } from 'react-icons/fi';
import AnalyticsPage from './analytics/page';

export default function EntrepreneurDashboard() {
  const [pitches, setPitches] = useState([]);
  const [startupInfo, setStartupInfo] = useState({
    founded: '',
    teamSize: '',
    industry: '',
    location: '',
    businessModel: '',
    revenue: ''
  });
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [newPitch, setNewPitch] = useState({
    name: '',
    description: '',
    fundingGoal: '',
    equityOffered: '',
    pitchDoc: null,
    pitchVideo: null,
  });
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('token') || token;
    console.log('Token check - localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing', 'Redux:', token ? 'Present' : 'Missing');
    if (!storedToken) {
      console.log('No token found, redirecting to login');
      router.push('/auth');
      return;
    }
    fetchData(storedToken);
  }, [router, token]);

  const fetchData = async (authToken) => {
    try {
      console.log('Fetching data with token:', authToken ? 'Present' : 'Missing');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const pitchesResponse = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include',
      });
      
      if (!pitchesResponse.ok) {
        const errorData = await pitchesResponse.json();
        console.error('Pitches response:', pitchesResponse.status, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${pitchesResponse.status}`);
      }
      
      const pitchesData = await pitchesResponse.json();
      setPitches(pitchesData.pitches || []);

      const infoResponse = await fetch(`${API_BASE_URL}/api/entrepreneur/startup-info`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include',
      });
      
      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        console.error('Startup info response:', infoResponse.status, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${infoResponse.status}`);
      }
      
      const infoData = await infoResponse.json();
      setStartupInfo({
        founded: infoData.founded || '',
        teamSize: infoData.teamSize || '',
        industry: infoData.industry || '',
        location: infoData.location || '',
        businessModel: infoData.businessModel || '',
        revenue: infoData.revenue || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        localStorage.removeItem('token');
        router.push('/auth');
      }
      setPitches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch({ ...newPitch, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewPitch({ ...newPitch, [name]: files[0] });
  };

  const handleStartupInfoChange = (e) => {
    const { name, value } = e.target;
    setStartupInfo({ ...startupInfo, [name]: value });
  };

  const handleStartupInfoSubmit = async (e) => {
    e.preventDefault();

    // Validate numeric fields
    const teamSize = startupInfo.teamSize ? parseInt(startupInfo.teamSize) : null;
    const foundedYear = startupInfo.founded ? parseInt(startupInfo.founded) : null;
    const revenue = startupInfo.revenue ? parseInt(startupInfo.revenue) : null;

    if (teamSize !== null && (isNaN(teamSize) || teamSize < 0)) {
      alert('Team Size must be a valid non-negative number');
      return;
    }

    if (foundedYear !== null && (isNaN(foundedYear) || foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      alert('Founded Year must be a valid year between 1900 and ' + new Date().getFullYear());
      return;
    }

    if (revenue !== null && (isNaN(revenue) || revenue < 0)) {
      alert('Revenue must be a valid non-negative number');
      return;
    }

    try {
      const authToken = localStorage.getItem('token') || token;
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/startup-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          founded: startupInfo.founded,
          teamSize: startupInfo.teamSize,
          industry: startupInfo.industry || null,
          location: startupInfo.location || null,
          businessModel: startupInfo.businessModel || null,
          revenue: startupInfo.revenue,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Startup info updated:', result);
        alert('Startup information updated successfully!');
        await fetchData(authToken); // Refresh startupInfo to reflect server data
        // Note: No need to manually reset startupInfo here; fetchData updates it with server values
      } else {
        const errorData = await response.json();
        console.error('Failed to update startup info:', response.status, errorData);
        alert(`Failed to update startup info: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating startup info:', error.message);
      alert(`Error: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        localStorage.removeItem('token');
        router.push('/auth');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPitch.name || !newPitch.description) {
      alert('Startup Name and Short Description are required');
      return;
    }

    const fundingGoal = parseFloat(newPitch.fundingGoal);
    const equityOffered = parseFloat(newPitch.equityOffered);

    if (isNaN(fundingGoal) || fundingGoal <= 0) {
      alert('Funding Goal must be a positive number');
      return;
    }

    if (isNaN(equityOffered) || equityOffered < 0 || equityOffered > 100) {
      alert('Equity Offered must be between 0 and 100');
      return;
    }

    // Handle numeric fields from startupInfo to prevent NaN
    const teamSize = startupInfo.teamSize ? parseInt(startupInfo.teamSize) : null;
    const foundedYear = startupInfo.founded ? parseInt(startupInfo.founded) : null;
    const revenue = startupInfo.revenue ? parseInt(startupInfo.revenue) : null;

    if (teamSize !== null && (isNaN(teamSize) || teamSize < 0)) {
      alert('Team Size must be a valid non-negative number');
      return;
    }

    if (foundedYear !== null && (isNaN(foundedYear) || foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      alert('Founded Year must be a valid year');
      return;
    }

    if (revenue !== null && (isNaN(revenue) || revenue < 0)) {
      alert('Revenue must be a valid non-negative number');
      return;
    }

    try {
      const authToken = localStorage.getItem('token') || token;
      console.log('Submitting pitch with token:', authToken ? 'Present' : 'Missing');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      let pitchDocUrl = null;
      let pitchVideoUrl = null;

      if (newPitch.pitchDoc) {
        const formData = new FormData();
        formData.append('file', newPitch.pitchDoc);
        const docResponse = await fetch(`${API_BASE_URL}/api/upload/pitch-file`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
          credentials: 'include',
        });
        if (!docResponse.ok) {
          const errorData = await docResponse.json();
          throw new Error(`Failed to upload pitch document: ${errorData.error || 'Unknown error'}`);
        }
        const docResult = await docResponse.json();
        pitchDocUrl = docResult.fileUrl;
      }

      if (newPitch.pitchVideo) {
        const formData = new FormData();
        formData.append('file', newPitch.pitchVideo);
        const videoResponse = await fetch(`${API_BASE_URL}/api/upload/pitch-file`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
          credentials: 'include',
        });
        if (!videoResponse.ok) {
          const errorData = await videoResponse.json();
          throw new Error(`Failed to upload pitch video: ${errorData.error || 'Unknown error'}`);
        }
        const videoResult = await videoResponse.json();
        pitchVideoUrl = videoResult.fileUrl;
      }

      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newPitch.name,
          description: newPitch.description,
          fundingGoal,
          equityOffered,
          pitchDocUrl,
          pitchVideoUrl,
          industry: startupInfo.industry || null,
          businessModel: startupInfo.businessModel || null,
          teamSize,
          foundedYear,
          location: startupInfo.location || null,
          revenue,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Pitch created:', result);
        alert('Pitch created successfully!');
        fetchData(authToken);
        setNewPitch({
          name: '',
          description: '',
          fundingGoal: '',
          equityOffered: '',
          pitchDoc: null,
          pitchVideo: null,
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create pitch:', response.status, errorData);
        alert(`Failed to create pitch: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating pitch:', error.message);
      alert(`Error: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        localStorage.removeItem('token');
        router.push('/auth');
      }
    }
  };

  if (!isClient || loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <>
      <div className="space-y-8 text-[#F0F0F0] px-4 sm:px-6 lg:px-10 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Entrepreneur Dashboard</h1>

        {/* Startup Information */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">Startup Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FiBriefcase className="text-[#D0140F]" />, label: 'Founded', value: startupInfo.founded || 'Not set' },
              { icon: <FiUsers className="text-[#D0140F]" />, label: 'Team Size', value: startupInfo.teamSize ? `${startupInfo.teamSize} members` : 'Not set' },
              { icon: <FiBriefcase className="text-[#D0140F]" />, label: 'Industry', value: startupInfo.industry || 'Not set' },
              { icon: <FiClock className="text-[#D0140F]" />, label: 'Location', value: startupInfo.location || 'Not set' },
              { icon: <FiDollarSign className="text-[#D0140F]" />, label: 'Business Model', value: startupInfo.businessModel || 'Not set' },
              { icon: <FiDollarSign className="text-[#D0140F]" />, label: 'Revenue', value: startupInfo.revenue || 'Not set' },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-[#2A2A2A] rounded-full">{item.icon}</div>
                <div>
                  <p className="text-sm text-[#AAAAAA]">{item.label}</p>
                  <p className="font-medium text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Startup Information */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">Update Startup Information</h2>
          <form onSubmit={handleStartupInfoSubmit} className="space-y-4">
            <InputField
              label="Founded Year"
              name="founded"
              value={startupInfo.founded}
              onChange={handleStartupInfoChange}
              type="number"
              placeholder="e.g., 2020"
            />
            <InputField
              label="Team Size"
              name="teamSize"
              value={startupInfo.teamSize}
              onChange={handleStartupInfoChange}
              type="number"
              placeholder="e.g., 5"
            />
            <InputField
              label="Industry"
              name="industry"
              value={startupInfo.industry}
              onChange={handleStartupInfoChange}
              placeholder="e.g., Technology"
            />
            <InputField
              label="Location"
              name="location"
              value={startupInfo.location}
              onChange={handleStartupInfoChange}
              placeholder="e.g., San Francisco, CA"
            />
            <InputField
              label="Business Model"
              name="businessModel"
              value={startupInfo.businessModel}
              onChange={handleStartupInfoChange}
              placeholder="e.g., SaaS"
            />
            <InputField
              label="Revenue"
              name="revenue"
              value={startupInfo.revenue}
              onChange={handleStartupInfoChange}
              type="number"
              placeholder="e.g., 10000"
            />
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStartupInfo({
                  founded: '',
                  teamSize: '',
                  industry: '',
                  location: '',
                  businessModel: '',
                  revenue: ''
                })}
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-[#3A3A3A] text-sm font-medium rounded-md text-[#F0F0F0] bg-[#252525] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-[#D0140F] hover:bg-[#B0100D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                Update Startup Info
              </button>
            </div>
          </form>
        </div>

        {/* Pitch Summary */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A] overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-white">Pitch Summary</h2>
          {pitches.length === 0 ? (
            <p className="text-[#AAAAAA] text-center py-8">No pitches found. Create your first pitch!</p>
          ) : (
            <table className="min-w-full divide-y divide-[#3A3A3A]">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  {['Pitch Name', 'Description', 'Status', 'Funding Goal', 'Equity', 'Date Submitted'].map((head, i) => (
                    <th key={i} className="px-4 py-2 text-left text-xs font-medium text-[#AAAAAA] uppercase tracking-wider">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3A3A]">
                {pitches.map((pitch) => (
                  <tr key={pitch.id} className="hover:bg-[#2A2A2A]">
                    <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{pitch.name}</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA]">{pitch.description}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${pitch.status === 'Pending'
                          ? 'bg-[#2A2A2A] text-[#FFB800] border border-[#FFB800]'
                          : pitch.status === 'Live'
                            ? 'bg-[#2A2A2A] text-[#00FFA3] border border-[#00FFA3]'
                            : 'bg-[#2A2A2A] text-[#D0140F] border border-[#D0140F]'
                        }`}>
                        {pitch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">${pitch.fundingGoal}</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">{pitch.equityOffered}%</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">
                      {new Date(pitch.dateSubmitted).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add New Pitch */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">Add New Pitch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Startup Name"
              name="name"
              value={newPitch.name}
              onChange={handleInputChange}
            />
            <TextArea
              label="Short Description"
              name="description"
              value={newPitch.description}
              onChange={handleInputChange}
            />
            <InputField
              label="Funding Goal"
              name="fundingGoal"
              value={newPitch.fundingGoal}
              onChange={handleInputChange}
              type="number"
            />
            <InputField
              label="Equity Offered"
              name="equityOffered"
              value={newPitch.equityOffered}
              onChange={handleInputChange}
              type="number"
              suffix="%"
            />

            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">Upload Pitch Documents</label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
                {['Doc', 'Video'].map((type) => (
                  <label key={type} className="flex items-center px-4 py-2 bg-[#1A1A1A] rounded-md border border-[#3A3A3A] shadow-sm text-sm font-medium text-[#F0F0F0] hover:bg-[#2A2A2A] cursor-pointer">
                    <FiUpload className="mr-2 text-[#D0140F]" />
                    Upload {type}
                    <input
                      type="file"
                      name={`pitch${type}`}
                      onChange={handleFileChange}
                      className="sr-only"
                      accept={type === 'Doc' ? '.pdf,.doc,.docx' : 'video/*'}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={() => setNewPitch({
                  name: '',
                  description: '',
                  fundingGoal: '',
                  equityOffered: '',
                  pitchDoc: null,
                  pitchVideo: null,
                })}
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-[#3A3A3A] text-sm font-medium rounded-md text-[#F0F0F0] bg-[#252525] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                Discard
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-[#D0140F] hover:bg-[#B0100D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                Submit Pitch
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnalyticsPage />
    </>
  );
}

function InputField({ label, name, value, onChange, suffix, type = 'text', placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#AAAAAA] mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full p-2 pr-10 bg-[#1A1A1A] border border-[#3A3A3A] text-[#F0F0F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          placeholder={placeholder || `Enter ${label}`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-3 flex items-center text-[#AAAAAA]">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#AAAAAA] mb-1">{label}</label>
      <textarea
        name={name}
        id={name}
        rows="3"
        value={value}
        onChange={onChange}
        className="block w-full p-2 bg-[#1A1A1A] border border-[#3A3A3A] text-[#F0F0F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
  );
}