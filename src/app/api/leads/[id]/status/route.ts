import { NextRequest, NextResponse } from 'next/server';
import { LeadStatus } from '@/types/lead';
import { mockDbService } from '@/services/mockDbService';

// PATCH /api/leads/[id]/status - Update a lead's status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, we would verify authentication here
    // For this mock app, we'll check the auth token in middleware.ts
    
    const id = params.id;
    
    // Parse the request body
    const body = await request.json();
    const { status } = body;
    
    // Validate the status
    if (!status || !Object.values(LeadStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Update the lead status
    const updatedLead = mockDbService.updateLead(id, { status });
    
    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedLead 
    });
    
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}