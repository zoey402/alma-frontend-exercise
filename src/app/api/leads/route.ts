import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/schemas/leadFormSchema';
import { mockDbService } from '@/services/mockDbService';
import { fileUploadService } from '@/services/fileUploadService';
import { z } from 'zod';

// POST /api/leads - Create a new lead (public endpoint)
export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    
    // Extract data from formData
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const linkedin = formData.get('linkedin') as string;
    const countryOfCitizenship = formData.get('countryOfCitizenship') as string;
    const interestedVisas = formData.getAll('interestedVisas') as string[];
    const openInput = formData.get('openInput') as string || '';
    
    // Handle file upload
    const resume = formData.get('resume') as File;
    let resumeUrl = '';
    
    if (resume) {
      // In a real app with our service, we would save the file
      const filePrefix = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
      resumeUrl = await fileUploadService.saveFile(resume, filePrefix);
    }
    
    // Create a data object for validation
    const leadData = {
      firstName,
      lastName,
      email,
      linkedin,
      countryOfCitizenship,
      interestedVisas,
      openInput,
      resume: resume ? new File([resume], resume.name, { type: resume.type }) : null,
    };
    
    // Validate the data
    try {
      leadFormSchema.parse(leadData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation failed', 
            details: validationError.errors 
          }, 
          { status: 400 }
        );
      }
      
      throw validationError;
    }
    
    // Create a new lead using our service
    const newLead = mockDbService.createLead({
      firstName,
      lastName,
      email,
      linkedin,
      countryOfCitizenship,
      interestedVisas,
      resumeUrl,
      openInput,
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      data: newLead 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create lead' 
    }, { status: 500 });
  }
}

// GET /api/leads - Get all leads (protected endpoint)
export async function GET(request: NextRequest) {
  // In a real app, we would verify authentication here
  // For this mock app, we'll check the auth token in middleware.ts
  
  try {
    // Get query parameters
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    
    // Get filtered and paginated leads
    const result = mockDbService.filterLeads({
      search: searchQuery,
      status: statusFilter,
      page,
      limit,
    });
    
    // Return paginated results
    return NextResponse.json({
      success: true,
      data: result.leads,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch leads' 
    }, { status: 500 });
  }
}