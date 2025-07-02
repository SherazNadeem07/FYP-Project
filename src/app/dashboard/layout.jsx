'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    } else {
      // Block going back to /auth after login
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        router.replace(window.location.href); // Stay on same page
      };
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
