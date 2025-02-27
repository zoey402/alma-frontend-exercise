import fs from 'fs';
import path from 'path';
import { Lead, LeadStatus } from '@/types/lead';
import { mockLeads } from '@/mock/leads';
import { countryOptions } from '@/constants/formData';

// Define the path to our data file
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure leads.json exists with initial data
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(mockLeads, null, 2));
}

class LeadsStorageService {
  // Helper to generate a UUID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  // Helper to get country name from country code
  private getCountryName(countryCode: string): string {
    const country = countryOptions.find(option => option.value === countryCode);
    return country ? country.label : countryCode;
  }

  // Read all leads from file
  private readLeadsFile(): Lead[] {
    try {
      const fileContent = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(fileContent) as Lead[];
    } catch (error) {
      console.error('Error reading leads file:', error);
      return [];
    }
  }

  // Write leads to file
  private writeLeadsFile(leads: Lead[]): void {
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    } catch (error) {
      console.error('Error writing leads file:', error);
    }
  }

  // Sort leads by updatedAt (most recent first)
  private sortLeads(leads: Lead[]): Lead[] {
    return [...leads].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  // Get all leads
  getAllLeads(): Lead[] {
    const leads = this.readLeadsFile();
    return this.sortLeads(leads);
  }
  
  // Get a lead by ID
  getLeadById(id: string): Lead | undefined {
    const leads = this.readLeadsFile();
    return leads.find(lead => lead.id === id);
  }
  
  // Create a new lead
  createLead(leadData: Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Lead {
    const leads = this.readLeadsFile();
    
    // Convert country code to proper name
    const countryOfCitizenship = this.getCountryName(leadData.countryOfCitizenship);
    
    const newLead: Lead = {
      ...leadData,
      countryOfCitizenship, // Use the proper country name
      id: this.generateId(),
      status: LeadStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    leads.push(newLead);
    this.writeLeadsFile(leads);
    return newLead;
  }
  
  // Update a lead
  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.readLeadsFile();
    const index = leads.findIndex(lead => lead.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedLead = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    leads[index] = updatedLead;
    this.writeLeadsFile(leads);
    return updatedLead;
  }
  
  // Delete a lead
  deleteLead(id: string): Lead | null {
    const leads = this.readLeadsFile();
    const index = leads.findIndex(lead => lead.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const deletedLead = leads[index];
    leads.splice(index, 1);
    this.writeLeadsFile(leads);
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
    
    let filteredLeads = this.readLeadsFile();
    
    // Sort leads by updatedAt (most recent first)
    filteredLeads = this.sortLeads(filteredLeads);
    
    // Apply search filter
    if (search) {
      filteredLeads = filteredLeads.filter(lead => 
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.countryOfCitizenship.toLowerCase().includes(search.toLowerCase())
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
      limit,
      page,
      totalPages,
    };
  }
  
  // Reset data to initial mock data
  resetData(): void {
    this.writeLeadsFile([...mockLeads]);
  }
}

// Create and export a singleton instance
export const leadsStorageService = new LeadsStorageService();