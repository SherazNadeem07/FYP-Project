'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { FiDollarSign, FiPercent, FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
    const storedToken = token || getCookie('token');
    if (!storedToken && isClient) {
      router.push('/auth');
      return;
    }
    if (storedToken) {
      fetchInvestments(storedToken);
    }

    const handleRefresh = () => fetchInvestments(storedToken);
    window.addEventListener('refreshInvestments', handleRefresh);
    return () => window.removeEventListener('refreshInvestments', handleRefresh);
  }, [router, token, isClient]);

  const fetchInvestments = async (authToken) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/investor/investments`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch investments');
      }

      const data = await response.json();
      setInvestments(data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error.message);
      alert(`Failed to load investments: ${error.message}`);
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        router.push('/auth');
      }
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInvestment = async (investmentId) => {
    if (!confirm('Are you sure you want to confirm this investment?')) {
      return;
    }

    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/investor/investments/${investmentId}/confirm`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm investment');
      }

      alert('Investment confirmed successfully!');
      fetchInvestments(authToken);
      window.dispatchEvent(new Event('refreshInvestments'));
    } catch (error) {
      console.error('Error confirming investment:', error.message);
      alert(`Failed to confirm investment: ${error.message}`);
      if (error.message.includes('Authentication token not found') || error.message.includes('401')) {
        router.push('/auth');
      }
    }
  };

  const handleRejectInvestment = async (investmentId) => {
    if (!confirm('Are you sure you want to reject this investment? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = token || getCookie('token');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/investor/investments/${investmentId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject investment');
      }

      alert('Investment rejected successfully!');
      fetchInvestments(authToken);
      window.dispatchEvent(new Event('refreshInvestments'));
    } catch (error) {
      console.error('Error rejecting investment:', error.message);
      alert(`Failed to reject investment: ${error.message}`);
      if (error.message.includes('Authentication token not found') || error.message.includes('401')) {
        router.push('/auth');
      }
    }
  };

  if (!isClient || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading investments...</div>;
  }

  const acceptedInvestments = investments.filter(inv => inv.status === 'Accepted');
  const totalAmount = acceptedInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const totalEquity = acceptedInvestments.reduce((sum, inv) => sum + parseFloat(inv.equity || 0), 0);
  const activeInvestments = acceptedInvestments.length;

  return (
    <div className="bg-[#252525] p-4 sm:p-6 rounded-lg border border-[#3A3A3A] mt-6 sm:mt-8 text-[#F0F0F0]">
      <h1 className="text-2xl font-bold mb-6 text-white">My Investments</h1>

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
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-[#AAAAAA] uppercase tracking-wider whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#252525] divide-y divide-[#3A3A3A]">
            {investments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-[#AAAAAA]">
                  No investments found.
                </td>
              </tr>
            ) : (
              investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-[#2A2A2A]">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-white font-medium">
                    {investment.startup || 'Unknown Startup'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[#AAAAAA]">
                    ${parseFloat(investment.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[#AAAAAA]">
                    {parseFloat(investment.equity || 0).toFixed(2)}%
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[#AAAAAA]">
                    {investment.dateInvested ? new Date(investment.dateInvested).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {investment.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmInvestment(investment.id)}
                          className="text-[#00FFA3] hover:text-[#00CC88] flex items-center"
                          title="Confirm this investment"
                        >
                          <FiCheck className="mr-1" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRejectInvestment(investment.id)}
                          className="text-[#D0140F] hover:text-[#B0100D] flex items-center"
                          title="Reject this investment"
                        >
                          <FiX className="mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 sm:p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
        <h3 className="font-medium text-white mb-4">Investment Summary</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-[#F0F0F0]">
          <div>
            <p className="text-sm text-[#AAAAAA]">Total Amount</p>
            <p className="text-xl font-bold">${totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#AAAAAA]">Total Equity</p>
            <p className="text-xl font-bold">{totalEquity.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-[#AAAAAA]">Active Investments</p>
            <p className="text-xl font-bold">{activeInvestments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}