'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lead, LeadStatus } from '@/types/lead';
import Sidebar from '@/components/dashboard/Sidebar';
import SearchFilterBar from '@/components/dashboard/SearchFilterBar';
import LeadsTable from '@/components/dashboard/LeadsTable';
import Pagination from '@/components/ui/Pagination';
import Loading from '@/components/ui/Loading';
import { mockLeads } from '@/mock/leads';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const leadsPerPage = 10;

  useEffect(() => {
    // Check if user is authenticated (in a real app, this would verify JWT, cookie, etc.)
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        await new Promise(resolve => setTimeout(resolve, 500));

        // NOTE: In a production application, this should be a real API request
        // to verify the user's authentication status based on JWT or session cookies
        setIsAuthenticated(true);

        // Try to fetch leads from API, fallback to mock data if API call fails
        try {
          const response = await fetch('/api/leads');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setLeads(data.data);
            } else {
              console.warn('Using mock data: API returned error', data.error);
              setLeads(mockLeads);
            }
          } else {
            console.warn('Using mock data: API request failed');
            setLeads(mockLeads);
          }
        } catch (error) {
          console.warn('Using mock data: API request failed', error);
          setLeads(mockLeads);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/login'); // Redirect to login if not authenticated
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Update lead status
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      // Try to update status via API
      try {
        const response = await fetch(`/api/leads/${leadId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.warn('Using optimistic update: API request failed', error);
      }
      
      // Update local state (optimistic update)
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { 
                ...lead, 
                status: newStatus, 
                updatedAt: new Date().toISOString() 
              } 
            : lead
        )
      );
    } catch (error) {
      console.error('Failed to update lead status:', error);
      // Handle error (e.g., show toast notification)
    }
  };

  // Filter leads based on search query and status filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      {/* Main content */}
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>
        
        <SearchFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <LeadsTable 
          leads={currentLeads}
          onUpdateStatus={handleUpdateStatus}
        />
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}