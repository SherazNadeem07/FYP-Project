'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EntrepreneurSidebar from '../EntrepreneurNavbar';

export default function EntrepreneurLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Push current URL to clear auth page history
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Prevent going back to login/signup
      router.replace(window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EntrepreneurSidebar />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  );
}
