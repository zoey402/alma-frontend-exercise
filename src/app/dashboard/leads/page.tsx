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
  const [totalPages, setTotalPages] = useState<number>(1);
  const leadsPerPage = 10;

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build the query string for filtering and pagination
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter) queryParams.append('status', statusFilter);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', leadsPerPage.toString());
      
      const response = await fetch(`/api/leads?${queryParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeads(data.data);
          setTotalPages(data.pagination.totalPages);
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
  }, [searchQuery, statusFilter, currentPage, leadsPerPage]);

  useEffect(() => {
    // Check if user is authenticated (in a real app, this would verify JWT, cookie, etc.)
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        await new Promise(resolve => setTimeout(resolve, 500));

        // NOTE: In a production application, this should be a real API request
        // to verify the user's authentication status based on JWT or session cookies
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/login'); // Redirect to login if not authenticated
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Only fetch leads if the user is authenticated
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated, fetchLeads]);

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
      
      // Refresh the lead list after updating
      await fetchLeads();
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchLeads(); // Fetch leads with new filters
  }, [fetchLeads]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // fetchLeads will be called by the useEffect that depends on currentPage
  };

  if (!isAuthenticated) {
    return <Loading />; // Show loading while checking authentication
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
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : (
          <>
            <LeadsTable 
              leads={leads}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={isUpdating}
            />
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}