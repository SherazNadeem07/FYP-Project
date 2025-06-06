'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiUser, FiDollarSign, FiMessageSquare, FiBell, FiLogOut } from 'react-icons/fi';
import { useSelector } from 'react-redux';

export default function InvestorNavbar() {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const notifications = 2;
  
  const getInitials = (name) => {
    if (!name) return 'IN';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isActive = (path) => pathname.includes(path);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600">
              {getInitials(user?.fullName)}
            </span>
          </div>
          <div>
            <h2 className="font-bold">{user?.fullName || 'Investor'}</h2>
            <p className="text-sm text-gray-500">Angel Investor</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Investments</p>
            <p className="font-semibold">5</p>
          </div>
          <div>
            <p className="text-gray-500">Committed</p>
            <p className="font-semibold">$325K</p>
          </div>
          <div>
            <p className="text-gray-500">Equity</p>
            <p className="font-semibold">27%</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard/investor"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/investor') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiHome className="text-lg" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/investor/investments"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/investor/investments') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiPieChart className="text-lg" />
          <span>My Investments</span>
        </Link>
        <Link
          href="/dashboard/investor/messages"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/investor/messages') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiMessageSquare className="text-lg" />
          <span>Messages</span>
          {notifications > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard/investor/analytics"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/investor/analytics') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiPieChart className="text-lg" />
          <span>Analytics</span>
        </Link>
        <Link
          href="/dashboard/investor/profile"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/investor/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiUser className="text-lg" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}