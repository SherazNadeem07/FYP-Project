
'use client';
import { useState } from 'react';
import { FiUpload, FiDollarSign, FiPercent, FiBriefcase, FiUsers, FiClock } from 'react-icons/fi';
import AnalyticsPage from './analytics/page';

export default function EntrepreneurDashboard() {
  const [pitches, setPitches] = useState([
    { id: 1, name: 'Eco-Friendly Packaging', status: 'Pending', amount: '$50,000', date: '01/25/2028', 
      description: 'Sustainable packaging solutions for e-commerce businesses', },
    { id: 2, name: 'Health Tracker App', status: 'Live', amount: '$75,000', date: '15/25/2028',
      description: 'AI-powered health monitoring and wellness platform' ,},
    { id: 3, name: 'Online Learning Platform', status: 'Funded', amount: '$100,000', date: '11/20/2028',
      description: 'Interactive courses for professional skill development',},
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
    <div className="space-y-8">
      {/* Startup Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Startup Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiBriefcase />
            </div>
            <div>
              <p className="text-sm text-gray-500">Founded</p>
              <p className="font-medium">{startupInfo.founded}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiUsers />
            </div>
            <div>
              <p className="text-sm text-gray-500">Team Size</p>
              <p className="font-medium">{startupInfo.teamSize} members</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiBriefcase />
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry</p>
              <p className="font-medium">{startupInfo.industry}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiClock />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{startupInfo.location}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Model</p>
              <p className="font-medium">{startupInfo.businessModel}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="font-medium">{startupInfo.revenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Pitch Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pitch Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pitches.map((pitch) => (
                <tr key={pitch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pitch.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pitch.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${pitch.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        pitch.status === 'Live' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {pitch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pitch.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pitch.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Pitch */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add New Pitch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Startup Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPitch.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea
              id="description"
              name="description"
              value={newPitch.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required
            />
          </div>
          <div>
            <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700">Funding Goal</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                value={newPitch.fundingGoal}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="equityOffered" className="block text-sm font-medium text-gray-700">Equity Offered</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="equityOffered"
                name="equityOffered"
                value={newPitch.equityOffered}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="0"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Pitch Documents</label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-white rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiUpload className="mr-2" />
                Upload Doc
                <input
                  type="file"
                  name="pitchDoc"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                />
              </label>
              <label className="flex items-center px-4 py-2 bg-white rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiUpload className="mr-2" />
                Upload Video
                <input
                  type="file"
                  name="pitchVideo"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept="video/*"
                />
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Pitch
            </button>
          </div>
        </form>
      </div>
    </div>
    <AnalyticsPage/>
  </>
    
  );
}