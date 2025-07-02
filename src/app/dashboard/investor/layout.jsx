'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InvestorNavbar from '../InvestorNavbar';

export default function InvestorLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      router.replace(window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorNavbar />
      <main className="container mx-auto px-4 py-8 ml-64">{children}</main>
    </div>
  );
}
