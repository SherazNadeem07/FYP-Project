'use client';
import { useState } from 'react';
import { FiUpload, FiDollarSign, FiPercent, FiBriefcase, FiUsers, FiClock } from 'react-icons/fi';
import AnalyticsPage from './analytics/page';

export default function EntrepreneurDashboard() {
  const [pitches, setPitches] = useState([
    { id: 1, name: 'Eco-Friendly Packaging', status: 'Pending', amount: '$50,000', date: '01/25/2028', description: 'Sustainable packaging solutions for e-commerce businesses' },
    { id: 2, name: 'Health Tracker App', status: 'Live', amount: '$75,000', date: '15/25/2028', description: 'AI-powered health monitoring and wellness platform' },
    { id: 3, name: 'Online Learning Platform', status: 'Funded', amount: '$100,000', date: '11/20/2028', description: 'Interactive courses for professional skill development' },
  ]);

  const [startupInfo, setStartupInfo] = useState({
    founded: '2022',
    teamSize: '8',
    industry: 'Technology',
    location: 'San Francisco, CA',
    businessModel: 'B2B SaaS',
    revenue: '$120K ARR',
  });

  const [newPitch, setNewPitch] = useState({
    name: '',
    description: '',
    fundingGoal: '',
    equityOffered: '',
    pitchDoc: null,
    pitchVideo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch({ ...newPitch, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewPitch({ ...newPitch, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New pitch submitted:', newPitch);
    setNewPitch({
      name: '',
      description: '',
      fundingGoal: '',
      equityOffered: '',
      pitchDoc: null,
      pitchVideo: null,
    });
  };

  return (
    <>
      <div className="space-y-8 text-[#F0F0F0] px-4 sm:px-6 lg:px-10 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Entrepreneur Dashboard</h1>

        {/* Startup Information */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">Startup Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FiBriefcase className="text-[#D0140F]" />, label: 'Founded', value: startupInfo.founded },
              { icon: <FiUsers className="text-[#D0140F]" />, label: 'Team Size', value: `${startupInfo.teamSize} members` },
              { icon: <FiBriefcase className="text-[#D0140F]" />, label: 'Industry', value: startupInfo.industry },
              { icon: <FiClock className="text-[#D0140F]" />, label: 'Location', value: startupInfo.location },
              { icon: <FiDollarSign className="text-[#D0140F]" />, label: 'Business Model', value: startupInfo.businessModel },
              { icon: <FiDollarSign className="text-[#D0140F]" />, label: 'Revenue', value: startupInfo.revenue },
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

        {/* Pitch Summary */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A] overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-white">Pitch Summary</h2>
          <table className="min-w-full divide-y divide-[#3A3A3A]">
            <thead className="bg-[#1A1A1A]">
              <tr>
                {['Pitch Name', 'Description', 'Status', 'Total Amount', 'Date Submitted'].map((head, i) => (
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
                  <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">{pitch.amount}</td>
                  <td className="px-4 py-3 text-sm text-[#AAAAAA] whitespace-nowrap">{pitch.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Pitch */}
        <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A]">
          <h2 className="text-lg font-semibold mb-4 text-white">Add New Pitch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Startup Name" name="name" value={newPitch.name} onChange={handleInputChange} />
            <TextArea label="Short Description" name="description" value={newPitch.description} onChange={handleInputChange} />
            <InputField label="Funding Goal" name="fundingGoal" value={newPitch.fundingGoal} onChange={handleInputChange} />
            <InputField label="Equity Offered" name="equityOffered" value={newPitch.equityOffered} onChange={handleInputChange} suffix="%" />

            {/* File Uploads */}
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

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
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

      {/* Analytics Component */}
      <AnalyticsPage />
    </>
  );
}

// Input field component
function InputField({ label, name, value, onChange, suffix }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#AAAAAA] mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full p-2 pr-10 bg-[#1A1A1A] border border-[#3A3A3A] text-[#F0F0F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
          placeholder={`Enter ${label}`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-3 flex items-center text-[#AAAAAA]">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// Textarea component
function TextArea({ label, name, value, onChange }) {
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
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}
