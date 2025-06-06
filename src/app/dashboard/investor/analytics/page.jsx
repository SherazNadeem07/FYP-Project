'use client';
import { FiTrendingUp, FiDollarSign, FiPieChart } from 'react-icons/fi';

export default function AnalyticsPage() {
  // Sample data for charts
  const performanceData = [
    { month: 'Jan', return: 5 },
    { month: 'Feb', return: 7 },
    { month: 'Mar', return: 10 },
    { month: 'Apr', return: 8 },
    { month: 'May', return: 12 },
    { month: 'Jun', return: 15 },
  ];

  const sectorDistribution = [
    { sector: 'Tech', value: 45 },
    { sector: 'Healthcare', value: 25 },
    { sector: 'Green Energy', value: 20 },
    { sector: 'Other', value: 10 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Investment Analytics</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total ROI</p>
              <h3 className="text-2xl font-bold">27.5%</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiTrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+2.5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Invested</p>
              <h3 className="text-2xl font-bold">$186K</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiDollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">+$25K this quarter</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Investments</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiPieChart size={24} />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">2 new this month</p>
        </div>
      </div>
      
      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Performance Over Time</h2>
        <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
          {/* In a real app, you would use a charting library like Chart.js here */}
          <div className="text-center">
            <p className="text-gray-500">Performance chart will be displayed here</p>
            <div className="mt-4 flex items-end justify-center space-x-2 h-40">
              {performanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-500 rounded-t-sm"
                    style={{ height: `${data.return * 10}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sector Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Sector Distribution</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-center h-64">
              {/* In a real app, you would use a pie chart here */}
              <div className="relative w-48 h-48 rounded-full">
                {sectorDistribution.map((sector, index) => (
                  <div
                    key={index}
                    className="absolute inset-0"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 + 50 * Math.cos(2 * Math.PI * (index / sectorDistribution.length))
                      }% ${
                        50 + 50 * Math.sin(2 * Math.PI * (index / sectorDistribution.length))
                      }%)`,
                      backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'
                      ][index],
                      opacity: 0.7
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="space-y-4">
              {sectorDistribution.map((sector, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{
                      backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'
                      ][index]
                    }}
                  ></div>
                  <span className="flex-1">{sector.sector}</span>
                  <span className="font-medium">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}