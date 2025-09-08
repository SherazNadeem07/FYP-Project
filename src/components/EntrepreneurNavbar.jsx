"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../Redux/Slices/AuthSlice';
import { getCookie } from 'cookies-next';
import { FiHome, FiPieChart, FiUser, FiFileText, FiLogOut, FiMessageSquare, FiX } from 'react-icons/fi';

export default function EntrepreneurSidebar({ isOpen = false, setIsOpen = () => {} }) {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({ totalPitches: 0, fundedPitches: 0, totalRaised: 0 });
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const notifications = 2;

  useEffect(() => {
    setIsClient(true);
    console.log('User from Redux:', user);
    console.log('Token from Redux:', token ? 'Present' : 'Missing');

    const fetchStats = async () => {
      try {
        const authToken = token || getCookie('token');
        console.log('Token for stats request:', authToken ? 'Present' : 'Missing');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('API_BASE_URL:', API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/api/entrepreneur/stats`, {
          headers: { Authorization: `Bearer ${authToken}` },
          credentials: 'include',
        });

        const data = await response.json();
        console.log('Stats API response:', { status: response.status, data });

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
        }

        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Stats fetch error:', err.message);
        setError(err.message);
        if (err.message.includes('No token found') || err.message.includes('401')) {
          dispatch(logout());
          router.push('/auth');
        }
      }
    };

    if (user && user.role === 'entrepreneur' && token) {
      fetchStats();
    } else {
      console.warn('User or token not loaded or not entrepreneur:', { user, token });
      // Avoid immediate redirect; wait for persisted state
      if (isClient && !token && !getCookie('token')) {
        router.push('/auth');
      }
    }
  }, [user, token, router, dispatch, isClient]);

  const handleLogout = () => {
    try {
      dispatch(logout());
      router.replace('/auth');
      window.history.pushState(null, '', '/auth');
      window.addEventListener('popstate', () => router.replace('/auth'), { once: true });
    } catch (error) {
      console.error('Logout error:', error.message);
      setError('Failed to log out. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isActive = (path) => pathname.includes(path);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  if (!isClient) return null;

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`}
      ></div>
      <div
        className={`
          fixed top-0 left-0 z-40 w-64 h-full bg-[#2C2C2C] border-r border-[#3F3F3F] text-[#E8E8E8]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="md:hidden flex justify-end p-4">
          <FiX className="text-white text-2xl cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>
        <div className="p-6 border-b border-[#3F3F3F]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#3A3A3A] flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-[#D0140F]">
                  {getInitials(user?.fullName)}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-[#FFFFFF]">{user?.fullName || 'User'}</h2>
              <p className="text-sm text-[#9ca3af] capitalize">{user?.role || 'Entrepreneur'}</p>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-2 bg-red-900/20 border border-red-800 rounded-md">
              <p className="text-[#D0140F] text-sm">{error}</p>
            </div>
          )}
          <div className="mt-4 flex justify-between text-sm text-[#B3B3B3]">
            <div>
              <p className="text-[#9ca3af]">Pitches</p>
              <p className="font-semibold text-[#FFFFFF]">{stats.totalPitches}</p>
            </div>
            <div>
              <p className="text-[#9ca3af]">Funded</p>
              <p className="font-semibold text-[#FFFFFF]">{stats.fundedPitches}</p>
            </div>
            <div>
              <p className="text-[#9ca3af]">Raised</p>
              <p className="font-semibold text-[#FFFFFF]">${(stats.totalRaised / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2 text-sm">
          <SidebarLink href="/dashboard/entrepreneur" icon={<FiHome />} label="Dashboard" isActive={isActive('/dashboard/entrepreneur')} onClick={closeSidebarOnMobile} />
          <SidebarLink href="/dashboard/entrepreneur/pitches" icon={<FiFileText />} label="My Pitches" isActive={isActive('/dashboard/entrepreneur/pitches')} onClick={closeSidebarOnMobile} />
          <SidebarLink href="/dashboard/entrepreneur/analytics" icon={<FiPieChart />} label="Analytics" isActive={isActive('/dashboard/entrepreneur/analytics')} onClick={closeSidebarOnMobile} />
          <SidebarLink href="/dashboard/entrepreneur/profile" icon={<FiUser />} label="Profile" isActive={isActive('/dashboard/entrepreneur/profile')} onClick={closeSidebarOnMobile} />
          <SidebarLink
            href="/dashboard/entrepreneur/messages"
            icon={<FiMessageSquare />}
            label="Messages"
            isActive={isActive('/dashboard/entrepreneur/messages')}
            notification={notifications}
            onClick={closeSidebarOnMobile}
          />
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-[#3F3F3F]">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg text-white cursor-pointer bg-[#D0140F] hover:bg-[#B0100D] w-full"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarLink({ href, icon, label, isActive, notification, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-[#D0140F] text-white' : 'text-[#B3B3B3] hover:bg-[#D0140F] hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      {notification > 0 && (
        <span className="bg-[#D0140F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notification}
        </span>
      )}
    </Link>
  );
}