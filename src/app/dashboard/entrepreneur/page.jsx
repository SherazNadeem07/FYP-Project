'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { FiUpload, FiDollarSign, FiPercent, FiBriefcase, FiUsers, FiClock, FiEdit, FiTrash } from 'react-icons/fi';
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
  const [investments, setInvestments] = useState([]);
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
  const [editingPitch, setEditingPitch] = useState(null);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
    const storedToken = token || getCookie('token');
    console.log('Token check - Cookie:', getCookie('token') ? 'Present' : 'Missing', 'Redux:', token ? 'Present' : 'Missing');
    if (!storedToken && isClient) {
      console.log('No token found, redirecting to login');
      router.push('/auth');
      return;
    }
    if (storedToken) {
      fetchData(storedToken);
    }
  }, [router, token, isClient]);

  const fetchData = async (authToken) => {
    try {
      console.log('Fetching data with token:', authToken ? 'Present' : 'Missing');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const pitchesResponse = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches`, {
        headers: { Authorization: `Bearer ${authToken}` },
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
        headers: { Authorization: `Bearer ${authToken}` },
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
      alert(`Error fetching data: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        setTimeout(() => {
          router.push('/auth');
        }, 1000);
      }
      setPitches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async (pitchId, authToken) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/investments/${pitchId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch investments');
      }

      const result = await response.json();
      setInvestments(result.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error.message);
      alert(`Error fetching investments: ${error.message}`);
      setInvestments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch({ ...newPitch, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
      
      if ((name === 'pitchDoc' && !allowedDocTypes.includes(files[0].type)) ||
          (name === 'pitchVideo' && !allowedVideoTypes.includes(files[0].type))) {
        alert(`Invalid file type for ${name === 'pitchDoc' ? 'document' : 'video'}. Allowed types: ${name === 'pitchDoc' ? 'PDF, DOC, DOCX' : 'MP4, AVI, MOV'}`);
        return;
      }
      if (files[0].size > maxSize) {
        alert(`File size exceeds 10MB limit for ${name === 'pitchDoc' ? 'document' : 'video'}`);
        return;
      }
      setNewPitch({ ...newPitch, [name]: files[0] });
    }
  };

  const handleStartupInfoChange = (e) => {
    const { name, value } = e.target;
    setStartupInfo({ ...startupInfo, [name]: value });
  };

  const handleStartupInfoSubmit = async (e) => {
    e.preventDefault();

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
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/startup-info`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
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
        await fetchData(authToken);
      } else {
        const errorData = await response.json();
        console.error('Failed to update startup info:', response.status, errorData);
        alert(`Failed to update startup info: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating startup info:', error.message);
      alert(`Error updating startup info: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        setTimeout(() => {
          router.push('/auth');
        }, 1000);
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

    try {
      const authToken = token || getCookie('token');
      console.log('Submitting pitch with token:', authToken ? 'Present' : 'Missing');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      let pitchDocUrl = editingPitch?.pitchDocUrl || null;
      let pitchVideoUrl = editingPitch?.pitchVideoUrl || null;

      if (newPitch.pitchDoc) {
        const formData = new FormData();
        formData.append('file', newPitch.pitchDoc);
        const docResponse = await fetch(`${API_BASE_URL}/api/upload/pitch-file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
          credentials: 'include',
        });
        if (!docResponse.ok) {
          const errorData = await docResponse.json();
          console.error('Document upload error:', errorData);
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
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
          credentials: 'include',
        });
        if (!videoResponse.ok) {
          const errorData = await videoResponse.json();
          console.error('Video upload error:', errorData);
          throw new Error(`Failed to upload pitch video: ${errorData.error || 'Unknown error'}`);
        }
        const videoResult = await videoResponse.json();
        pitchVideoUrl = videoResult.fileUrl;
      }

      const method = editingPitch ? 'PUT' : 'POST';
      const url = editingPitch 
        ? `${API_BASE_URL}/api/entrepreneur/pitches/${editingPitch.id}`
        : `${API_BASE_URL}/api/entrepreneur/pitches`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
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
          teamSize: startupInfo.teamSize ? parseInt(startupInfo.teamSize) : null,
          foundedYear: startupInfo.founded ? parseInt(startupInfo.founded) : null,
          location: startupInfo.location || null,
          revenue: startupInfo.revenue ? parseInt(startupInfo.revenue) : null,
          status: editingPitch ? editingPitch.status : 'Live', // Retain status for edit, default to Live for new
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(editingPitch ? 'Pitch updated:' : 'Pitch created:', result);
        alert(editingPitch ? 'Pitch updated successfully!' : 'Pitch created successfully!');
        fetchData(authToken);
        setNewPitch({
          name: '',
          description: '',
          fundingGoal: '',
          equityOffered: '',
          pitchDoc: null,
          pitchVideo: null,
        });
        setEditingPitch(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to save pitch:', response.status, errorData);
        alert(`Failed to ${editingPitch ? 'update' : 'create'} pitch: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving pitch:', error.message);
      alert(`Error saving pitch: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        setTimeout(() => {
          router.push('/auth');
        }, 1000);
      }
    }
  };

  const handleEditPitch = (pitch) => {
    setEditingPitch(pitch);
    setNewPitch({
      name: pitch.name,
      description: pitch.description,
      fundingGoal: pitch.fundingGoal.toString(),
      equityOffered: pitch.equityOffered.toString(),
      pitchDoc: null, // Files need to be re-uploaded
      pitchVideo: null,
    });
    window.scrollTo({ top: document.querySelector('#add-new-pitch').offsetTop, behavior: 'smooth' });
  };

  const handleDeletePitch = async (pitchId) => {
    if (!confirm('Are you sure you want to delete this pitch? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches/${pitchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Pitch deleted:', pitchId);
        alert('Pitch deleted successfully!');
        fetchData(authToken);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete pitch:', response.status, errorData);
        alert(`Failed to delete pitch: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting pitch:', error.message);
      alert(`Error deleting pitch: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        setTimeout(() => {
          router.push('/auth');
        }, 1000);
      }
    }
  };

  const handleViewPitch = async (pitchId) => {
    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('No token found');
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const pitchResponse = await fetch(`${API_BASE_URL}/api/entrepreneur/pitches/${pitchId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (!pitchResponse.ok) {
        const errorData = await pitchResponse.json();
        throw new Error(errorData.error || 'Failed to fetch pitch details');
      }

      const result = await pitchResponse.json();
      setSelectedPitch(result.pitch);
      fetchInvestments(pitchId, authToken);
    } catch (error) {
      console.error('Error fetching pitch details:', error.message);
      alert(`Error fetching pitch details: ${error.message}`);
      if (error.message.includes('No token found') || error.message.includes('401')) {
        setTimeout(() => {
          router.push('/auth');
        }, 1000);
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
              { icon: <FiDollarSign className="text-[#D0140F]" />, label: 'Revenue', value: startupInfo.revenue ? `$${startupInfo.revenue}` : 'Not set' },
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
                  {['Pitch Name', 'Description', 'Status', 'Funding Goal', 'Equity', 'Investors', 'Total Invested', 'Date Submitted', 'Actions'].map((head, i) => (
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
                            : pitch.status === 'Funded'
                            ? 'bg-[#2A2A2A] text-[#00FFA3] border border-[#00FFA3]'
                            : 'bg-[#2A2A2A] text-[#D0140F] border border-[#D0140F]'
                        }`}>
                        {pitch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">${pitch.fundingGoal.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">{pitch.equityOffered}%</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">{pitch.investorCount}</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">${pitch.totalInvested ? pitch.totalInvested.toLocaleString() : '0'}</td>
                    <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">
                      {new Date(pitch.dateSubmitted).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleViewPitch(pitch.id)}
                        className="text-[#D0140F] hover:text-[#B0100D]"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditPitch(pitch)}
                        className="text-[#FFB800] hover:text-[#E6A700]"
                        disabled={pitch.status === 'Funded' || pitch.status === 'Live'}
                        title={pitch.status === 'Funded' || pitch.status === 'Live' ? 'Cannot edit funded or live pitches' : ''}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePitch(pitch.id)}
                        className="text-[#D0140F] hover:text-[#B0100D]"
                        disabled={pitch.status === 'Funded' || pitch.status === 'Live'}
                        title={pitch.status === 'Funded' || pitch.status === 'Live' ? 'Cannot delete funded or live pitches' : ''}
                      >
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pitch Details Modal */}
        {selectedPitch && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1A1A1A] text-[#F0F0F0] rounded-lg p-4 sm:p-6 w-full max-w-3xl border border-[#3A3A3A] overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Pitch Details: {selectedPitch.name}</h2>
              <div className="space-y-4">
                <p><strong>Description:</strong> {selectedPitch.description}</p>
                <p><strong>Status:</strong> {selectedPitch.status}</p>
                <p><strong>Funding Goal:</strong> ${selectedPitch.fundingGoal.toLocaleString()}</p>
                <p><strong>Equity Offered:</strong> {selectedPitch.equityOffered}%</p>
                <p><strong>Investors:</strong> {selectedPitch.investorCount}</p>
                <p><strong>Total Invested:</strong> ${selectedPitch.totalInvested ? selectedPitch.totalInvested.toLocaleString() : '0'}</p>
                {selectedPitch.pitchDocUrl && (
                  <p><strong>Pitch Document:</strong> <a href={selectedPitch.pitchDocUrl} target="_blank" className="text-[#D0140F] hover:underline">View Document</a></p>
                )}
                {selectedPitch.pitchVideoUrl && (
                  <p><strong>Pitch Video:</strong> <a href={selectedPitch.pitchVideoUrl} target="_blank" className="text-[#D0140F] hover:underline">View Video</a></p>
                )}
                <p><strong>Industry:</strong> {selectedPitch.industry || 'Not set'}</p>
                <p><strong>Business Model:</strong> {selectedPitch.businessModel || 'Not set'}</p>
                <p><strong>Team Size:</strong> {selectedPitch.teamSize || 'Not set'}</p>
                <p><strong>Founded Year:</strong> {selectedPitch.foundedYear || 'Not set'}</p>
                <p><strong>Location:</strong> {selectedPitch.location || 'Not set'}</p>
                <p><strong>Revenue:</strong> {selectedPitch.revenue ? `$${selectedPitch.revenue.toLocaleString()}` : 'Not set'}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Investments</h3>
                {investments.length === 0 ? (
                  <p className="text-[#AAAAAA] text-center py-4">No investments found for this pitch.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#3A3A3A]">
                      <thead className="bg-[#252525]">
                        <tr>
                          {['Investor Name', 'Amount', 'Status', 'Date Invested'].map((head, i) => (
                            <th key={i} className="px-4 py-2 text-left text-xs font-medium text-[#AAAAAA] uppercase tracking-wider">
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3A3A3A]">
                        {investments.map((investment) => (
                          <tr key={investment.id} className="hover:bg-[#2A2A2A]">
                            <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{investment.investorName}</td>
                            <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">${investment.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${investment.status === 'Pending'
                                  ? 'bg-[#2A2A2A] text-[#FFB800] border border-[#FFB800]'
                                  : investment.status === 'Approved'
                                    ? 'bg-[#2A2A2A] text-[#00FFA3] border border-[#00FFA3]'
                                    : 'bg-[#2A2A2A] text-[#D0140F] border border-[#D0140F]'
                                }`}>
                                {investment.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">
                              {new Date(investment.dateInvested).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setSelectedPitch(null);
                    setInvestments([]);
                  }}
                  className="px-4 py-2 border border-[#3A3A3A] rounded-lg text-[#F0F0F0] bg-[#252525] hover:bg-[#2A2A2A]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Pitch */}
        <div id="add-new-pitch" className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">{editingPitch ? 'Edit Pitch' : 'Add New Pitch'}</h2>
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
                      accept={type === 'Doc' ? '.pdf,.doc,.docx' : 'video/mp4,video/avi,video/mov'}
                    />
                  </label>
                ))}
              </div>
              {editingPitch && (
                <p className="text-sm text-[#AAAAAA] mt-2">
                  Note: Re-upload files if you want to update them. Current: 
                  {editingPitch.pitchDocUrl ? <a href={editingPitch.pitchDocUrl} target="_blank" className="text-[#D0140F] hover:underline">Document</a> : 'No document'}
                  {editingPitch.pitchVideoUrl && ', '}
                  {editingPitch.pitchVideoUrl ? <a href={editingPitch.pitchVideoUrl} target="_blank" className="text-[#D0140F] hover:underline">Video</a> : 'No video'}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setNewPitch({
                    name: '',
                    description: '',
                    fundingGoal: '',
                    equityOffered: '',
                    pitchDoc: null,
                    pitchVideo: null,
                  });
                  setEditingPitch(null);
                }}
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-[#3A3A3A] text-sm font-medium rounded-md text-[#F0F0F0] bg-[#252525] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                {editingPitch ? 'Cancel Edit' : 'Discard'}
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-[#D0140F] hover:bg-[#B0100D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0140F]"
              >
                {editingPitch ? 'Update Pitch' : 'Submit Pitch'}
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