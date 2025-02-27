import { NextResponse } from 'next/server';
import { mockDbService } from '@/services/mockDbService';

// GET /api/leads/[id] - Get a single lead by ID
export async function GET(
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, we would verify authentication here
    // For this mock app, we'll check the auth token in middleware.ts
    
    const id = params.id;
    
    // Find the lead by ID
    const lead = mockDbService.getLeadById(id);
    
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: lead });
    
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}