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

// Allowed photo package sizes - must match the values in the API
const ALLOWED_PHOTO_PACKAGES = [30, 50, 75, 100, 150, 200];

export default function EventForm({ onSubmit, initialData = {} }) {
  // Ensure initial maxPhotos is a valid value
  const defaultMaxPhotos = initialData.maxPhotos && ALLOWED_PHOTO_PACKAGES.includes(initialData.maxPhotos) 
    ? initialData.maxPhotos 
    : 50;
    
  const [formData, setFormData] = useState({
    maxPhotos: defaultMaxPhotos,
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'maxPhotos') {
      const numValue = parseInt(value, 10);
      // Only allow valid photo package values
      if (ALLOWED_PHOTO_PACKAGES.includes(numValue)) {
        setFormData(prev => ({
          ...prev,
          [name]: numValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Double-check that maxPhotos is valid before submitting
    if (!ALLOWED_PHOTO_PACKAGES.includes(formData.maxPhotos)) {
      setError(`Paquete de fotos inválido. Valores permitidos: ${ALLOWED_PHOTO_PACKAGES.join(', ')}`);
      return;
    }
    
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
      setError(error.message || 'Error al guardar el evento. Por favor intenta de nuevo.');
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
  
  // For now, we're only showing 30 and 50 options in the UI
  // But we validate against all allowed values
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-500 mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-lg font-medium mb-4 text-center">
          Paquete de fotos
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input 
              type="radio" 
              id="photos30" 
              name="maxPhotos" 
              value="30" 
              checked={formData.maxPhotos === 30}
              onChange={handleChange}
              className="sr-only" 
            />
            <label 
              htmlFor="photos30" 
              className={`block py-6 px-4 rounded-lg text-center cursor-pointer transition-all ${
                formData.maxPhotos === 30 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <div className="text-3xl font-bold mb-1">30</div>
              <div className="text-sm">fotos</div>
            </label>
          </div>
          
          <div className="relative">
            <input 
              type="radio" 
              id="photos50" 
              name="maxPhotos" 
              value="50" 
              checked={formData.maxPhotos === 50}
              onChange={handleChange}
              className="sr-only" 
            />
            <label 
              htmlFor="photos50" 
              className={`block py-6 px-4 rounded-lg text-center cursor-pointer transition-all ${
                formData.maxPhotos === 50 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <div className="text-3xl font-bold mb-1">50</div>
              <div className="text-sm">fotos</div>
            </label>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Selecciona el número máximo de fotos para tu evento
        </p>
      </div>
      
      {/* Hidden field to prevent tampering - this ensures the value is always one of the allowed values */}
      <input 
        type="hidden" 
        name="maxPhotosValidation" 
        value={ALLOWED_PHOTO_PACKAGES.includes(formData.maxPhotos) ? formData.maxPhotos : 50} 
      />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 font-medium text-lg"
      >
        {isSubmitting ? 'Creando...' : 'Crear Evento'}
      </button>
    </form>
  );
} 