// /components/Navbar.js
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpenDesktop, setDropdownOpenDesktop] = useState(false);
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const dropdownRefDesktop = useRef();
  const dropdownRefMobile = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRefDesktop.current && !dropdownRefDesktop.current.contains(event.target)) {
        setDropdownOpenDesktop(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRefMobile.current && !dropdownRefMobile.current.contains(event.target)) {
        setDropdownOpenMobile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let interval;
    const fetchUnread = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: contacts, error } = await supabase.rpc('get_conversations', {
          current_user_id: user.id,
        });
        if (!error && contacts) {
          const totalUnread = contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
          setUnreadCount(totalUnread);
        }
      } else {
        setUnreadCount(0);
      }
    };
    fetchUnread();
    interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
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

    let badgeChannel = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        badgeChannel = supabase
          .channel('badge-unread-messages')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          }, (payload) => {
            checkUser();
          })
          .subscribe();
      }
    });

    const handleUpdateBadge = () => checkUser();
    window.addEventListener('update-unread-badge', handleUpdateBadge);

    return () => {
      listener?.subscription.unsubscribe();
      if (badgeChannel) supabase.removeChannel(badgeChannel);
      window.removeEventListener('update-unread-badge', handleUpdateBadge);
    };
  }, []);

  const handleDashboardRedirect = () => {
    setDropdownOpenDesktop(false);
    setDropdownOpenMobile(false);
    if (role === 'Admin') {
      router.push('/admin-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <nav id="navbar" className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="logo flex items-center">
          <Image 
            src="/Logo-grande.png" 
            alt="Connectiamo" 
            width={140} 
            height={40} 
            className="hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        {user && (
          <div className="hidden md:flex items-center ml-6 gap-3 relative" ref={dropdownRefDesktop}>
            <button
              className="flex items-center gap-2 focus:outline-none hover:bg-yellow-100/10 px-2 py-1 rounded transition"
              onClick={() => setDropdownOpenDesktop((open) => !open)}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400" />
              ) : (
                <span className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                    <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                  </svg>
                </span>
              )}
              <span className="text-yellow-300 font-semibold">
                {nickname ? `Ciao, ${nickname}!` : 'Utente'}
              </span>
              <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpenDesktop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpenDesktop && (
              <div className="absolute top-full mt-2 right-0 w-52 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-5 py-3 hover:bg-yellow-100 text-gray-900 rounded-t"
                  onClick={handleDashboardRedirect}
                >
                  {role === 'Admin' ? 'Gestione sito' : 'Modifica profilo'}
                </button>
                <button
                  className="w-full text-left px-5 py-3 hover:bg-yellow-100 text-gray-900 rounded-b"
                  onClick={() => { setDropdownOpenDesktop(false); router.push('/logout'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <Link href="/come-funziona" className="hover:text-yellow-400">Come funziona</Link>
          {user ? (
            <Link href="/messages" className="hover:text-yellow-400 flex items-center gap-1">
              Messaggi
              {unreadCount > 0 && (
                <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-400">Login</Link>
              <Link href="/signup" className="hover:text-yellow-400">Registrati</Link>
            </>
          )}
        </div>

        {user && (
          <div className="md:hidden flex items-center ml-4 gap-2 relative" ref={dropdownRefMobile}>
            <button
              className="flex items-center gap-2 focus:outline-none hover:bg-yellow-100/10 px-2 py-1 rounded transition"
              onClick={() => setDropdownOpenMobile((open) => !open)}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400" />
              ) : (
                <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900">
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                    <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                  </svg>
                </span>
              )}
              <span className="text-yellow-300 font-semibold">
                {nickname || 'Utente'}
              </span>
              <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpenMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpenMobile && (
              <div className="absolute top-full mt-2 right-0 w-52 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-5 py-3 hover:bg-yellow-100 text-gray-900 rounded-t"
                  onClick={handleDashboardRedirect}
                >
                  {role === 'Admin' ? 'Gestione sito' : 'Modifica profilo'}
                </button>
                <button
                  className="w-full text-left px-5 py-3 hover:bg-yellow-100 text-gray-900 rounded-b"
                  onClick={() => { setDropdownOpenMobile(false); router.push('/logout'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

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

      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-4 px-2">
          <Link href="/" className="block hover:text-yellow-400 text-lg py-3 rounded">Home</Link>
          <Link href="/come-funziona" className="block hover:text-yellow-400 text-lg py-3 rounded">Come funziona</Link>
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
                    
