import { useState, useEffect } from 'react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-md">
      <div className="text-xl font-bold text-blue-900 dark:text-white">
        Connectiamo
      </div>

      <div className="hidden md:flex space-x-4 text-gray-800 dark:text-gray-200">
        <a href="#" className="hover:text-blue-600">Home</a>
        <a href="#" className="hover:text-blue-600">Chi siamo</a>
        <a href="#" className="hover:text-blue-600">Come funziona</a>
        <a href="#" className="hover:text-blue-600">Contatti</a>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded">
          Login
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-600 dark:text-gray-300 focus:outline-none"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
