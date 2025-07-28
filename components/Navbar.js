import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, avatar_url, role')
          .eq('id', user.id)
          .single();
        if (profile) {
          setNickname(profile.nickname || '');
          setAvatar(profile.avatar_url || '');
          setRole(profile.role || '');
        }
      } else {
        setNickname('');
        setAvatar('');
        setRole('');
      }
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleRedirect = () => {
    setDropdownOpen(false);
    if (role === 'Admin') {
      router.push('/admin-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">Connectiamo</Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-yellow-400 hidden md:block">Home</Link>
          {user ? (
            <>
              <Link href="/messages" className="hover:text-yellow-400 hidden md:block">Messaggi</Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none hover:bg-yellow-100/10 px-3 py-1 rounded transition"
                >
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                      <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                    </svg>
                  </div>
                  <span className="text-yellow-300 font-semibold">
                    {nickname ? `Ciao, ${nickname}!` : 'Utente'}
                  </span>
                  <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-yellow-100 text-gray-900 rounded-t"
                      onClick={handleRedirect}
                    >
                      {role === 'Admin' ? 'Gestione sito' : 'Area personale'}
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-yellow-100 text-gray-900 rounded-b"
                      onClick={() => { setDropdownOpen(false); router.push('/logout'); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-400">Login</Link>
              <Link href="/signup" className="hover:text-yellow-400">Registrati</Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu Mobile">
            {mobileMenuOpen ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-4 px-2">
          <Link href="/" className="block hover:text-yellow-400 text-lg py-3 rounded">Home</Link>
          {user ? (
            <Link href="/messages" className="block hover:text-yellow-400 text-lg py-3 rounded">Messaggi</Link>
          ) : (
            <>
              <Link href="/login" className="block hover:text-yellow-400 text-lg py-3 rounded">Login</Link>
              <Link href="/signup" className="block hover:text-yellow-400 text-lg py-3 rounded">Registrati</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
