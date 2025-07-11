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

  const maxViews = Math.max(...performanceData.map((d) => d.views));

  return (
    <div className="space-y-8 text-[#E8E8E8] bg-[#2C2C2C] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Pitch Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3] text-sm">Total Views</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white">1,245</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiEye size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+300 this month</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3] text-sm">Total Likes</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white">356</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiHeart size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+90 this month</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B3B3B3] text-sm">Total Comments</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white">89</h3>
            </div>
            <div className="p-3 rounded-full bg-red-600/20 text-white">
              <FiMessageCircle size={24} />
            </div>
          </div>
          <p className="text-sm text-red-400 mt-2">+25 this month</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Views Over Time</h2>
        <div className="bg-[#2C2C2C] h-64 rounded-lg flex items-center justify-center">
          <div className="text-center w-full">
            <p className="text-[#B3B3B3]">Views growth chart</p>
            <div className="mt-4 flex items-end justify-center gap-2 h-40 px-2 sm:px-8">
              {performanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 sm:w-8 bg-red-500 rounded-t-sm transition-all duration-300"
                    style={{ height: `${(data.views / maxViews) * 100}%` }}
                  ></div>
                  <span className="text-xs text-[#B3B3B3] mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fundraising Progress */}
      <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow-sm border border-[#3F3F3F]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Fundraising Progress</h2>
        <div className="bg-[#2C2C2C] h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FiTrendingUp size={36} className="mx-auto text-red-500" />
            <p className="text-[#B3B3B3] mt-2">
              Graph showing funding milestones will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
