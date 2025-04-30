import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Since the Event model doesn't have a direct relation to User in the schema,
// we need to first implement this relation or use a different approach.

export async function GET(request) {
  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Now we can use the createdById field to filter events
    const events = await prisma.event.findMany({
      where: {
        createdById: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Failed to fetch your events' }, { status: 500 });
  }
} 