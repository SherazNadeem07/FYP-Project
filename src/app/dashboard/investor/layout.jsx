'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import InvestorSidebar from '../InvestorNavbar';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    } else {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        router.replace(window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isAuthenticated, router]);

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/dashboard.png')" }}
    >
      {/* Sidebar */}
      <InvestorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-[#D0140F] p-2 rounded-md text-white"
        >
          <FiMenu className="text-xl" />
        </button>
      )}

      {/* Main Content with margin on md+ screens */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 mt-14 md:mt-0 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
