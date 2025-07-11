'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntrepreneurSidebar from '../EntrepreneurNavbar';
import { FiMenu } from 'react-icons/fi';

export default function EntrepreneurLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      router.replace(window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/dashboard.png')" }}
    >
      {/* Sidebar */}
      <EntrepreneurSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-[#D0140F] text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FiMenu className="text-xl" />
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full mt-14 md:mt-0 md:ml-64 p-4 sm:p-6 md:p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
