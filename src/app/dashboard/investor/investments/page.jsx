'use client';
import { useState } from 'react';
import { FiDollarSign, FiPercent, FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function InvestmentsPage() {
  const [investments] = useState([
    {
      id: 1,
      startup: "Health Tracker App",
      amount: "$75,000",
      equity: "5%",
      status: "Accepted",
      date: "2023-05-15"
    },
    {
      id: 2,
      startup: "Clearface Startup",
      amount: "$52,000",
      equity: "10%",
      status: "Pending",
      date: "2023-06-22"
    },
    {
      id: 3,
      startup: "Food Delivery Service",
      amount: "$59,000",
      equity: "12%",
      status: "Rejected",
      date: "2023-04-10"
    }
  ]);

  return (
    <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A] mt-6 sm:mt-8 text-[#F0F0F0]">
      <h1 className="text-2xl font-bold mb-6 text-white">My Investments</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#3A3A3A] text-sm">
          <thead className="bg-[#1A1A1A]">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Startup/Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Investment Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Equity Received
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#252525] divide-y divide-[#3A3A3A]">
            {investments.map((investment) => (
              <tr key={investment.id} className="hover:bg-[#2A2A2A]">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-white font-medium">
                  {investment.startup}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[#AAAAAA]">
                  {investment.amount}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[#AAAAAA]">
                  {investment.equity}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      investment.status === 'Accepted'
                        ? 'bg-[#2A2A2A] text-[#00FFA3] border-[#00FFA3]'
                        : investment.status === 'Rejected'
                        ? 'bg-[#2A2A2A] text-[#D0140F] border-[#D0140F]'
                        : 'bg-[#2A2A2A] text-[#FFB800] border-[#FFB800]'
                    }`}
                  >
                    {investment.status === 'Accepted' ? (
                      <FiCheck className="mr-1" />
                    ) : investment.status === 'Rejected' ? (
                      <FiX className="mr-1" />
                    ) : (
                      <FiClock className="mr-1" />
                    )}
                    {investment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 sm:p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
        <h3 className="font-medium text-white mb-4">Total Investments</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-[#F0F0F0]">
          <div>
            <p className="text-sm text-[#AAAAAA]">Total Amount</p>
            <p className="text-xl font-bold">$186,000</p>
          </div>
          <div>
            <p className="text-sm text-[#AAAAAA]">Total Equity</p>
            <p className="text-xl font-bold">27%</p>
          </div>
          <div>
            <p className="text-sm text-[#AAAAAA]">Active Investments</p>
            <p className="text-xl font-bold">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
