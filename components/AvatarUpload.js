
import React, { useRef, useState } from 'react';

export default function AvatarUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onUpload) onUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {preview ? (
        <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-600" />
      ) : (
        <div className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-400 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
            <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
          </svg>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Carica Avatar
      </button>
    </div>
  );
}
