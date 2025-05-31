// src/app/dashboard/layout.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your dashboard layout */}
      {children}
    </div>
  );
}