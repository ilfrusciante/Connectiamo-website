import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-bold hover:text-yellow-400">Connectiamo</a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Apri menu mobile">
            {mobileMenuOpen ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
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
