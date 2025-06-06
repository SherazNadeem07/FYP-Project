'use client';
import { useState } from 'react';
import { FiDollarSign, FiPercent, FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">My Investments</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup/Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.map(investment => (
              <tr key={investment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {investment.startup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {investment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {investment.equity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    investment.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    investment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
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
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Total Investments</h3>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-blue-700">Total Amount</p>
            <p className="text-xl font-bold">$186,000</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Total Equity</p>
            <p className="text-xl font-bold">27%</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Active Investments</p>
            <p className="text-xl font-bold">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}