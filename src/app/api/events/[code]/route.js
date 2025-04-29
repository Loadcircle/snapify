import { NextResponse } from 'next/server';
import { getEventByCode, updateEvent, deleteEvent } from '@/lib/services/eventService';

// GET /api/events/[code]
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams.code;
    
    if (!code) {
      return NextResponse.json({ error: 'Event code is required' }, { status: 400 });
    }
    
    const event = await getEventByCode(code);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event by code:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PATCH /api/events/[code]
export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams.code;
    
    const body = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Event code is required' }, { status: 400 });
    }
    
    // Get the event first to ensure it exists
    const existingEvent = await getEventByCode(code);
    
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    const updatedEvent = await updateEvent(existingEvent.id, body);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[code]
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams.code;
    
    if (!code) {
      return NextResponse.json({ error: 'Event code is required' }, { status: 400 });
    }
    
    // Get the event first to ensure it exists
    const existingEvent = await getEventByCode(code);
    
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    await deleteEvent(existingEvent.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 