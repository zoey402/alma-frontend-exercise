import React, { useCallback, useEffect, useState } from 'react';
import { LeadStatus } from '@/types/lead';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onFilterChange?: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onFilterChange
}) => {
  // Local state to track input value before debouncing
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Initialize the input value with the searchQuery prop
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Handle input changes with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  }, []);

  // Set up debounced effect for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
        if (onFilterChange) {
          onFilterChange();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery, onFilterChange]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    if (onFilterChange) {
      onFilterChange();
    }
  }, [setStatusFilter, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="form-input pl-10 w-full p-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Search"
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="w-full sm:w-40">
        <select
          className="form-input w-full p-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value={LeadStatus.PENDING}>Pending</option>
          <option value={LeadStatus.REACHED_OUT}>Reached Out</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;