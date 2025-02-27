'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Check if user is authenticated using cookies
      const authToken = getCookie('authToken');
      
      if (!authToken) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }, [router]);
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
            <p className="mt-2 text-text-secondary">Loading...</p>
          </div>
        </div>
      );
    }
  
    return <>{children}</>;
  }