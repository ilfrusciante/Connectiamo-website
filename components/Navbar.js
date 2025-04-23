import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-[#0f1e3c] dark:bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Connectiamo</div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/"><a className="hover:text-yellow-400">Home</a></Link>
          <Link href="/faq"><a className="hover:text-yellow-400">FAQ</a></Link>
          <Link href="/login"><a className="hover:text-yellow-400">Login</a></Link>
          <Link href="/signup"><a className="hover:text-yellow-400">Registrati</a></Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 text-lg"
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <Link href="/"><a className="block hover:text-yellow-400">Home</a></Link>
          <Link href="/faq"><a className="block hover:text-yellow-400">FAQ</a></Link>
          <Link href="/login"><a className="block hover:text-yellow-400">Login</a></Link>
          <Link href="/signup"><a className="block hover:text-yellow-400">Registrati</a></Link>
        </div>
      )}
    </nav>
  );
}
