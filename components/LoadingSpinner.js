
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-yellow-300"></div>
    </div>
  );
}
