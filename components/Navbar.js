import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname, role')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setUserData(data);
        }
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-[#0D1B2A] text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link href="/" className="text-xl font-bold text-white">
        Connectiamo
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        {session && <Link href="/messages" className="hover:text-yellow-400">Messaggi</Link>}
        {!session && (
          <>
            <Link href="/login" className="hover:text-yellow-400">Login</Link>
            <Link href="/signup" className="hover:text-yellow-400">Registrati</Link>
          </>
        )}
        {session && (
          <div className="relative group cursor-pointer">
            <div className="flex items-center space-x-1">
              <UserCircleIcon className="h-7 w-7 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Ciao, {userData?.nickname || '!'}</span>
            </div>
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg hidden group-hover:block z-50">
              {userData?.role === 'Admin' ? (
                <Link href="/admin-dashboard" className="block px-4 py-2 hover:bg-gray-200">Gestione sito</Link>
              ) : (
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Area personale</Link>
              )}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#0D1B2A] text-white py-4 px-6 shadow-md z-50">
          <Link href="/" className="block py-2 border-b border-gray-600">Home</Link>
          {session && <Link href="/messages" className="block py-2 border-b border-gray-600">Messaggi</Link>}
          {!session && (
            <>
              <Link href="/login" className="block py-2 border-b border-gray-600">Login</Link>
              <Link href="/signup" className="block py-2 border-b border-gray-600">Registrati</Link>
            </>
          )}
          {session && (
            <>
              {userData?.role === 'Admin' ? (
                <Link href="/admin-dashboard" className="block py-2 border-b border-gray-600">Gestione sito</Link>
              ) : (
                <Link href="/dashboard" className="block py-2 border-b border-gray-600">Area personale</Link>
              )}
              <button onClick={handleLogout} className="block py-2 text-left w-full">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
