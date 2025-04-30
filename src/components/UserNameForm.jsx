'use client';

import { useState, useEffect } from 'react';

export default function UserNameForm({ initialName = '', onSave }) {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(!initialName);
  
  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  
  return (
    <div className="border rounded-md p-4 mb-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Your Name</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your name"
            autoFocus
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                if (initialName) {
                  setName(initialName);
                  setIsEditing(false);
                }
              }}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
              disabled={!initialName}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 font-medium">{name}</p>
      )}
    </div>
  );
} 