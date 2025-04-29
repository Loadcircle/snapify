'use client';

import { useState } from 'react';
import { generateEventCode } from '@/lib/utils/codeGenerator';

export default function EventForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    code: initialData.code || generateEventCode(),
    maxPhotos: initialData.maxPhotos || 50,
    expiresAt: initialData.expiresAt ? 
      new Date(initialData.expiresAt).toISOString().split('T')[0] : 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
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
      // Convert expiresAt to an ISO string with time at the end of the day
      const expiresAt = new Date(formData.expiresAt);
      expiresAt.setHours(23, 59, 59, 999);
      
      await onSubmit({
        ...formData,
        expiresAt: expiresAt.toISOString()
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateNewCode = () => {
    setFormData(prev => ({
      ...prev,
      code: generateEventCode()
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
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Event Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={generateNewCode}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Generate
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="maxPhotos" className="block text-sm font-medium mb-1">
          Maximum Photos
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
      </div>
      
      <div>
        <label htmlFor="expiresAt" className="block text-sm font-medium mb-1">
          Expiration Date
        </label>
        <input
          type="date"
          id="expiresAt"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Saving...' : initialData.id ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
} 