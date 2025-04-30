import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    // Check if the user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch all events
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 