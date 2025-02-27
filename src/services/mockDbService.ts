import { Lead, LeadStatus } from '@/types/lead';
import { mockLeads as initialMockLeads } from '@/mock/leads';

// Singleton service to manage mock data
class MockDbService {
  private leads: Lead[];
  
  constructor() {
    this.leads = [...initialMockLeads];
  }
  
  // Helper to generate a unique ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
  
  // Get all leads
  getAllLeads(): Lead[] {
    return this.leads;
  }
  
  // Get a lead by ID
  getLeadById(id: string): Lead | undefined {
    return this.leads.find(lead => lead.id === id);
  }
  
  // Create a new lead
  createLead(leadData: Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...leadData,
      id: this.generateId(),
      status: LeadStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.leads.push(newLead);
    return newLead;
  }
  
  // Update a lead
  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const index = this.leads.findIndex(lead => lead.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedLead = {
      ...this.leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.leads[index] = updatedLead;
    return updatedLead;
  }
  
  // Delete a lead
  deleteLead(id: string): Lead | null {
    const index = this.leads.findIndex(lead => lead.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const deletedLead = this.leads[index];
    this.leads.splice(index, 1);
    return deletedLead;
  }
  
  // Filter and paginate leads
  filterLeads(options: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): {
    leads: Lead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const {
      search = '',
      status = '',
      page = 1,
      limit = 10,
    } = options;
    
    let filteredLeads = [...this.leads];
    
    // Apply search filter
    if (search) {
      filteredLeads = filteredLeads.filter(lead => 
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }
    
    // Calculate pagination
    const total = filteredLeads.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
    
    return {
      leads: paginatedLeads,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

// Create and export a singleton instance
export const mockDbService = new MockDbService();