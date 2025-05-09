import { NextResponse } from 'next/server';
import { createEvent, getEventById } from '@/lib/services/eventService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Allowed photo package sizes
const ALLOWED_PHOTO_PACKAGES = [30, 50, 75, 100, 150, 200];

// GET /api/events/:id
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere ID del evento' }, { status: 400 });
    }
    
    const event = await getEventById(id);
    
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Error al obtener el evento' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.code || !body.maxPhotos || !body.expiresAt) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: título, código, máximo de fotos, fecha de expiración' }, 
        { status: 400 }
      );
    }
    
    // Strict validation for maxPhotos
    const maxPhotos = parseInt(body.maxPhotos, 10);
    
    // Ensure it's a number and one of the allowed values
    if (isNaN(maxPhotos) || !ALLOWED_PHOTO_PACKAGES.includes(maxPhotos)) {
      return NextResponse.json(
        { error: `Valor de máximo de fotos inválido. Los valores permitidos son: ${ALLOWED_PHOTO_PACKAGES.join(', ')}` }, 
        { status: 400 }
      );
    }
    
    // Add the user ID to connect the event to the creator
    const eventData = {
      ...body,
      // Force the maxPhotos to be one of the allowed values
      maxPhotos: ALLOWED_PHOTO_PACKAGES.includes(maxPhotos) ? maxPhotos : 50,
      createdById: session.user.id
    };
    
    const event = await createEvent(eventData);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Check if the error is related to the event limit
    if (error.message && error.message.includes('Has alcanzado el límite de')) {
      return NextResponse.json({ 
        error: error.message,
        limitReached: true
      }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Error al crear el evento' }, { status: 500 });
  }
} 