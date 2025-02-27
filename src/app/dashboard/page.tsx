'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the leads page when accessing the dashboard root
    router.push('/dashboard/leads');
  }, [router]);

  // Show loading indicator while redirecting
  return <Loading />;
}