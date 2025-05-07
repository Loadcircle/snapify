import { NextResponse } from 'next/server';
import { createPhoto, getPhotoById, getPhotosByEventId, countPhotosByDeviceInEvent, getPhotosByDeviceInEvent } from '@/lib/services/photoService';
import { getEventById } from '@/lib/services/eventService';

// GET /api/photos?id=123 or /api/photos?eventId=456 or /api/photos?eventId=456&deviceId=789
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const eventId = url.searchParams.get('eventId');
    const deviceId = url.searchParams.get('deviceId');
    
    // If id is provided, get single photo
    if (id) {
      const photo = await getPhotoById(id);
      
      if (!photo) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
      }
      
      return NextResponse.json(photo);
    }
    
    // If eventId and deviceId are provided, get photos by device for event
    if (eventId && deviceId) {
      const photos = await getPhotosByDeviceInEvent(eventId, deviceId);
      return NextResponse.json(photos);
    }
    
    // If only eventId is provided, get all photos for event
    if (eventId) {
      const photos = await getPhotosByEventId(eventId);
      return NextResponse.json(photos);
    }
    
    // If neither id nor eventId is provided
    return NextResponse.json({ error: 'Photo ID or Event ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching photo(s):', error);
    return NextResponse.json({ error: 'Failed to fetch photo(s)' }, { status: 500 });
  }
}

// POST /api/photos
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.eventId || !body.url || !body.creator || !body.publicId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, url, creator, publicId' }, 
        { status: 400 }
      );
    }
    
    // Check if event exists
    const event = await getEventById(body.eventId);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Check if event has reached max photos
    if (event.usedPhotos >= event.maxPhotos) {
      return NextResponse.json(
        { error: 'Event has reached maximum number of photos' }, 
        { status: 400 }
      );
    }
    
    // Check if event has expired
    if (new Date(event.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Event has expired' }, { status: 400 });
    }
    
    // If deviceId is provided, check if the device has reached its limit
    if (body.deviceId) {
      const devicePhotoCount = await countPhotosByDeviceInEvent(body.eventId, body.deviceId);
      const maxPhotosPerDevice = event.maxPhotosPerUser || event.maxPhotos;
      
      if (devicePhotoCount >= maxPhotosPerDevice) {
        return NextResponse.json(
          { error: 'You have reached the maximum number of photos allowed for this event' }, 
          { status: 400 }
        );
      }
    }
    
    const photo = await createPhoto({
      eventId: body.eventId,
      url: body.url,
      publicId: body.publicId,
      width: body.width || 0,
      height: body.height || 0,
      creator: body.creator,
      deviceId: body.deviceId || null,
    });
    
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
} 