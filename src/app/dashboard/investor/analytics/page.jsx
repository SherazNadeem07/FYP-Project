'use client';
import { FiTrendingUp, FiDollarSign, FiPieChart } from 'react-icons/fi';

export default function AnalyticsPage() {
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
    <div className="space-y-8 bg-[#252525] p-4 sm:p-6 rounded-lg text-white">
      <h1 className="text-2xl font-bold text-white">Investment Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3A3A3A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total ROI</p>
              <h3 className="text-2xl font-bold text-white">27.5%</h3>
            </div>
            <div className="p-3 rounded-full bg-green-200/20 text-[#D0140F]">
              <FiTrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-[#D0140F] mt-2">+2.5% from last month</p>
        </div>

        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3A3A3A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Invested</p>
              <h3 className="text-2xl font-bold text-white">$186K</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-200/20 text-[#D0140F]">
              <FiDollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-[#D0140F] mt-2">+$25K this quarter</p>
        </div>

        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3A3A3A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Active Investments</p>
              <h3 className="text-2xl font-bold text-white">5</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-200/20 text-[#D0140F]">
              <FiPieChart size={24} />
            </div>
          </div>
          <p className="text-sm text-[#D0140F] mt-2">2 new this month</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3A3A3A]">
        <h2 className="text-lg font-semibold text-white mb-4">Performance Over Time</h2>
        <div className="bg-[#2a2a2a] h-64 rounded-lg flex items-center justify-center overflow-x-auto">
          <div className="text-center w-full max-w-full px-2 sm:px-4">
            <p className="text-gray-400">Performance chart will be displayed here</p>
            <div className="mt-4 flex items-end justify-center space-x-2 h-40 overflow-x-auto px-1">
              {performanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 sm:w-8 bg-[#D0140F] rounded-t-sm"
                    style={{ height: `${data.return * 10}px` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Distribution */}
      <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3A3A3A]">
        <h2 className="text-lg font-semibold text-white mb-4">Sector Distribution</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-center h-64">
              <div className="relative w-40 sm:w-48 h-40 sm:h-48 rounded-full">
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
                      backgroundColor: ['#D0140F', '#3A3A3A', '#3A3A3A', '#D0140F'][index],
                      opacity: 0.7,
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
                      backgroundColor: ['#D0140F', '#3A3A3A', '#FFFFFF', '#3025d3'][index],
                    }}
                  ></div>
                  <span className="flex-1 text-white">{sector.sector}</span>
                  <span className="font-medium text-white">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
