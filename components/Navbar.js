import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <nav className="bg-[#0f1e3c] dark:bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-bold text-yellow-400 hover:text-yellow-300">Connectiamo</a>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/"><a className="hover:text-yellow-400">Home</a></Link>
          {user ? (
            <>
              <Link href="/dashboard"><a className="hover:text-yellow-400">Area personale</a></Link>
              <Link href="/messages"><a className="hover:text-yellow-400">Messaggi</a></Link>
              <Link href="/logout"><a className="hover:text-yellow-400">Logout</a></Link>
            </>
          ) : (
            <>
              <Link href="/login"><a className="hover:text-yellow-400">Login</a></Link>
              <Link href="/signup"><a className="hover:text-yellow-400">Registrati</a></Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <Link href="/"><a className="block hover:text-yellow-400">Home</a></Link>
          {user ? (
            <>
              <Link href="/dashboard"><a className="block hover:text-yellow-400">Area personale</a></Link>
              <Link href="/messages"><a className="block hover:text-yellow-400">Messaggi</a></Link>
              <Link href="/logout"><a className="block hover:text-yellow-400">Logout</a></Link>
            </>
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
