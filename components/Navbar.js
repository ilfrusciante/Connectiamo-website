import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-[#0f1e3c] dark:bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Connectiamo</div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/"><a className="hover:text-yellow-400">Home</a></Link>
          <Link href="/faq"><a className="hover:text-yellow-400">FAQ</a></Link>

          {user ? (
            <button onClick={handleLogout} className="hover:text-yellow-400">Logout</button>
          ) : (
            <>
              <Link href="/login"><a className="hover:text-yellow-400">Login</a></Link>
              <Link href="/signup"><a className="hover:text-yellow-400">Registrati</a></Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✖' : '☰'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-lg"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <Link href="/"><a className="block hover:text-yellow-400">Home</a></Link>
          <Link href="/faq"><a className="block hover:text-yellow-400">FAQ</a></Link>

          {user ? (
            <button onClick={handleLogout} className="block w-full text-left hover:text-yellow-400">Logout</button>
          ) : (
            <>
              <Link href="/login"><a className="block hover:text-yellow-400">Login</a></Link>
              <Link href="/signup"><a className="block hover:text-yellow-400">Registrati</a></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
