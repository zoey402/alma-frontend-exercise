'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Lead, LeadStatus } from '@/types/lead';
import Sidebar from '@/components/dashboard/Sidebar';
import SearchFilterBar from '@/components/dashboard/SearchFilterBar';
import LeadsTable from '@/components/dashboard/LeadsTable';
import Pagination from '@/components/ui/Pagination';
import Loading from '@/components/ui/Loading';


export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const leadsPerPage = 10;

  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeads(data.data);
        } else {
          console.error('Error fetching leads:', data.error);
        }
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated (in a real app, this would verify JWT, cookie, etc.)
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        await new Promise(resolve => setTimeout(resolve, 500));

        // NOTE: In a production application, this should be a real API request
        // to verify the user's authentication status based on JWT or session cookies
        setIsAuthenticated(true);
        await fetchLeads();
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/login'); // Redirect to login if not authenticated
      }
    };
    checkAuth();
  }, [router, fetchLeads]);

  // Update lead status
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      setIsUpdating(prev => ({ ...prev, [leadId]: true }));
      
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      await fetchLeads();
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // 重置到第一页
  }, []);

  // Filter leads based on search query and status filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
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
          onFilterChange={handleFilterChange}
        />
        
        <LeadsTable 
          leads={currentLeads}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
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