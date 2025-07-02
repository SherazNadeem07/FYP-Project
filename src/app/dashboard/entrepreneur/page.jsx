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
    revenue: '$120K ARR'
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
      <div className="space-y-8 bg-bgDark text-textLight min-h-screen px-6 py-8">
        {/* Startup Information Section */}
        <div className="bg-bgAction p-6 rounded-lg border border-borderGray">
          <h2 className="text-lg font-semibold mb-4 text-textWhite">Startup Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FiBriefcase />, label: 'Founded', value: startupInfo.founded },
              { icon: <FiUsers />, label: 'Team Size', value: `${startupInfo.teamSize} members` },
              { icon: <FiBriefcase />, label: 'Industry', value: startupInfo.industry },
              { icon: <FiClock />, label: 'Location', value: startupInfo.location },
              { icon: <FiDollarSign />, label: 'Business Model', value: startupInfo.businessModel },
              { icon: <FiDollarSign />, label: 'Revenue', value: startupInfo.revenue },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-[#3A3A3A] rounded-full text-red">{item.icon}</div>
                <div>
                  <p className="text-sm text-textDim">{item.label}</p>
                  <p className="font-medium text-textWhite">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pitch Summary */}
        <div className="bg-bgAction p-6 rounded-lg border border-borderGray">
          <h2 className="text-lg font-semibold mb-4 text-textWhite">Pitch Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderGray">
              <thead className="bg-bgDark">
                <tr>
                  {['Pitch Name', 'Description', 'Status', 'Total Amount', 'Date Submitted'].map((head, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-textDim uppercase tracking-wider">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderGray">
                {pitches.map((pitch) => (
                  <tr key={pitch.id} className="hover:bg-[#383838]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textWhite">{pitch.name}</td>
                    <td className="px-6 py-4 text-sm text-textDim">{pitch.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${pitch.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pitch.status === 'Live'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {pitch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDim">{pitch.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDim">{pitch.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Pitch */}
        <div className="bg-bgAction p-6 rounded-lg border border-borderGray">
          <h2 className="text-lg font-semibold mb-4 text-textWhite">Add New Pitch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Startup Name" name="name" value={newPitch.name} onChange={handleInputChange} />
            <TextArea label="Short Description" name="description" value={newPitch.description} onChange={handleInputChange} />
            <InputField label="Funding Goal" name="fundingGoal" icon={<FiDollarSign />} value={newPitch.fundingGoal} onChange={handleInputChange} />
            <InputField label="Equity Offered" name="equityOffered" suffix="%" value={newPitch.equityOffered} onChange={handleInputChange} />

            <div>
              <label className="block text-sm font-medium text-textGray mb-1">Upload Pitch Documents</label>
              <div className="flex items-center space-x-4">
                {['Doc', 'Video'].map((type) => (
                  <label key={type} className="flex items-center px-4 py-2 bg-bgDark rounded-md border border-borderGray shadow-sm text-sm font-medium text-textLiteGray hover:bg-[#4A4A4A] cursor-pointer">
                    <FiUpload className="mr-2" />
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

            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
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

// Reusable input field
function InputField({ label, name, value, onChange, icon, suffix }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-textGray mb-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textliteGray">{icon}</div>}
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`block w-full p-2 pl-${icon ? '10' : '3'} pr-${suffix ? '10' : '3'} bg-bgDark border border-borderGray text-textWhite rounded-md focus:outline-none focus:ring-1 focus:ring-red`}
        />
        {suffix && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-textliteGray">{suffix}</div>}
      </div>
    </div>
  );
}

function TextArea({ label, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-textGray mb-1">{label}</label>
      <textarea
        name={name}
        id={name}
        rows="3"
        value={value}
        onChange={onChange}
        className="block w-full p-2 bg-bgDark border border-borderGray text-textWhite rounded-md focus:outline-none focus:ring-1 focus:ring-red"
      />
    </div>
  );
}
