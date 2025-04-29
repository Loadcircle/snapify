import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/utils/cloudinary';
import { getEventByCode } from '@/lib/services/eventService';

// POST /api/upload
// Handles direct upload to Cloudinary
export async function POST(request) {
  try {
    // Get the form data from the request
    const data = await request.formData();
    const file = data.get('file');
    const eventCode = data.get('eventCode');
    const creator = data.get('creator');
    
    // Validate required fields
    if (!file || !eventCode || !creator) {
      return NextResponse.json(
        { error: 'Missing required fields: file, eventCode, creator' }, 
        { status: 400 }
      );
    }
    
    // Check if the event exists
    const event = await getEventByCode(eventCode);
    
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
    
    // Convert the file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Upload the image to Cloudinary
    const uploadResult = await uploadImage(base64, eventCode);
    
    // Return the upload result
    return NextResponse.json({
      success: true,
      eventId: event.id,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      width: uploadResult.width,
      height: uploadResult.height,
      creator,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' }, 
      { status: 500 }
    );
  }
} 