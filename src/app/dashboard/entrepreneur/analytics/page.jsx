'use client';
import { FiEye, FiHeart, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';

export default function EntrepreneurAnalyticsPage() {
  const performanceData = [
    { month: 'Jan', views: 300 },
    { month: 'Feb', views: 500 },
    { month: 'Mar', views: 750 },
    { month: 'Apr', views: 650 },
    { month: 'May', views: 900 },
    { month: 'Jun', views: 1245 },
  ];

  return (
    <div className="space-y-8 text-[#E8E8E8] bg-[#2C2C2C] p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Pitch Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#383838] p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3]">Total Views</p>
              <h3 className="text-2xl font-bold text-white">1,245</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiEye size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+300 this month</p>
        </div>

        <div className="bg-[#383838] p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3]">Total Likes</p>
              <h3 className="text-2xl font-bold text-white">356</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiHeart size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+90 this month</p>
        </div>

        <div className="bg-[#383838] p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3]">Total Comments</p>
              <h3 className="text-2xl font-bold text-white">89</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiMessageCircle size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+25 this month</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#383838] p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
        <h2 className="text-lg font-semibold mb-4 text-white">Views Over Time</h2>
        <div className="bg-[#2C2C2C] h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#B3B3B3]">Views growth chart</p>
            <div className="mt-4 flex items-end justify-center space-x-2 h-40">
              {performanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-red-500 rounded-t-sm"
                    style={{ height: `${data.views / 10}px` }}
                  ></div>
                  <span className="text-xs text-[#B3B3B3] mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fundraising Progress Placeholder */}
      <div className="bg-[#383838] p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
        <h2 className="text-lg font-semibold mb-4 text-white">Fundraising Progress</h2>
        <div className="bg-[#2C2C2C] h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FiTrendingUp size={36} className="mx-auto text-red-500" />
            <p className="text-[#B3B3B3] mt-2">Graph showing funding milestones will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
