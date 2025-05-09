'use client';

import { useState } from 'react';
import { generateEventCode } from '@/lib/utils/codeGenerator';

// Define los mismos filtros que en la página de captura
const FILTERS = {
  none: { name: 'Normal', css: '' },
  sepia: { name: 'Vintage', css: 'sepia(0.7)' },
  grayscale: { name: 'B&W', css: 'grayscale(1)' },
  contrast: { name: 'Vivid', css: 'contrast(1.5) saturate(1.5)' },
  warm: { name: 'Warm', css: 'sepia(0.3) saturate(1.6) hue-rotate(-15deg)' },
};

export default function EventForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    maxPhotos: initialData.maxPhotos || 50,
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPhotos' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Generate other required fields automatically
      const eventData = {
        ...formData,
        title: 'Mi Evento', // Default title
        code: generateEventCode(), // Auto-generate code
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days from now
        allowedFilters: 'none', // Default filter option
      };
      
      await onSubmit(eventData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle filter selection - can select multiple filters or just one
  const handleFilterChange = (e) => {
    const { value, options } = e.target;
    
    // Get all selected options
    const selectedFilters = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    // Join with commas to store as string
    setFormData(prev => ({
      ...prev,
      allowedFilters: selectedFilters.join(',')
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-500 mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="maxPhotos" className="block text-sm font-medium mb-1">
          Límite de fotos
        </label>
        <input
          type="number"
          id="maxPhotos"
          name="maxPhotos"
          value={formData.maxPhotos}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-2 border rounded-md"
        />
        <p className="text-xs text-gray-500 mt-1">
          Número máximo de fotos permitidas para este evento
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
} 