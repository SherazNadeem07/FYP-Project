'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiUser, FiFileText, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { useSelector } from 'react-redux';

export default function EntrepreneurSidebar() {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
const notifications=2;
  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return 'User'; 
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isActive = (path) => pathname.includes(path);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-600">
              {getInitials(user?.fullName)}
            </span>
          </div>
          <div>
            <h2 className="font-bold">{user?.fullName || 'User'}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role || 'Entrepreneur'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Pitches</p>
            <p className="font-semibold">3</p>
          </div>
          <div>
            <p className="text-gray-500">Funded</p>
            <p className="font-semibold">2</p>
          </div>
          <div>
            <p className="text-gray-500">Raised</p>
            <p className="font-semibold">$175K</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard/entrepreneur"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/entrepreneur') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiHome className="text-lg" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/pitches"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/entrepreneur/pitches') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiFileText className="text-lg" />
          <span>My Pitches</span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/analytics"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/entrepreneur/analytics') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiPieChart className="text-lg" />
          <span>Analytics</span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/profile"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/entrepreneur/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiUser className="text-lg" />
          <span>Profile</span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/messages"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard/entrepreneur/messages') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <FiMessageSquare className="text-lg" />
          <span>Messages</span>
          {notifications > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
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