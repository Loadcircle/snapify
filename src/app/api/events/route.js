import { NextResponse } from 'next/server';
import { createEvent, getEventById } from '@/lib/services/eventService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/events/:id
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    const event = await getEventById(id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.code || !body.maxPhotos || !body.expiresAt) {
      return NextResponse.json(
        { error: 'Missing required fields: title, code, maxPhotos, expiresAt' }, 
        { status: 400 }
      );
    }
    
    // Add the user ID to connect the event to the creator
    const eventData = {
      ...body,
      createdById: session.user.id
    };
    
    const event = await createEvent(eventData);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 