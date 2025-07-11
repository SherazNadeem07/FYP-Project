'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiPieChart,
  FiUser,
  FiFileText,
  FiLogOut,
  FiMessageSquare,
  FiX
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Redux/Slices/AuthSlice';

export default function EntrepreneurSidebar({ isOpen = false, setIsOpen = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const notifications = 2;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/auth');
    window.history.pushState(null, '', '/auth');
    window.addEventListener('popstate', () => router.replace('/auth'));
  };

  const getInitials = (name) => {
    if (!name) return 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isActive = (path) => pathname.includes(path);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`}
      ></div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 w-64 h-full bg-[#2C2C2C] border-r border-[#3F3F3F] text-[#E8E8E8]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Close icon for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <FiX className="text-white text-2xl cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-[#3F3F3F]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#3A3A3A] flex items-center justify-center">
              <span className="text-lg font-bold text-[#D0140F]">
                {getInitials(user?.fullName)}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-[#FFFFFF]">{user?.fullName || 'User'}</h2>
              <p className="text-sm text-[#9ca3af] capitalize">
                {user?.role || 'Entrepreneur'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm text-[#B3B3B3]">
            <div>
              <p className="text-[#9ca3af]">Pitches</p>
              <p className="font-semibold text-[#FFFFFF]">3</p>
            </div>
            <div>
              <p className="text-[#9ca3af]">Funded</p>
              <p className="font-semibold text-[#FFFFFF]">2</p>
            </div>
            <div>
              <p className="text-[#9ca3af]">Raised</p>
              <p className="font-semibold text-[#FFFFFF]">$175K</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
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

        {/* Logout */}
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
        isActive
          ? 'bg-[#D0140F] text-white'
          : 'text-[#B3B3B3] hover:bg-[#D0140F] hover:text-white'
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
