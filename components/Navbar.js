// pages/Navbar.js

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
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
  const router = useRouter();
  const dropdownRefDesktop = useRef();
  const dropdownRefMobile = useRef();
  const [unreadCount, setUnreadCount] = useState(0);

  // Gestione click fuori dal dropdown desktop
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRefDesktop.current && !dropdownRefDesktop.current.contains(event.target)) {
        setDropdownOpenDesktop(false);
      }
    }
    if (dropdownOpenDesktop) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenDesktop]);

  // Gestione click fuori dal dropdown mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRefMobile.current && !dropdownRefMobile.current.contains(event.target)) {
        setDropdownOpenMobile(false);
      }
    }
    if (dropdownOpenMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenMobile]);

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

        const { data: contacts, error } = await supabase.rpc('get_conversations', {
          current_user_id: user.id,
        });
        if (!error && contacts) {
          const totalUnread = contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
          setUnreadCount(totalUnread);
        }
      } else {
        setNickname('');
        setAvatar('');
        setRole('');
        setUnreadCount(0);
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
          }, () => {
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

  const getDashboardLink = () => role === 'Admin' ? '/admin-dashboard' : '/dashboard';
  const getDashboardLabel = () => role === 'Admin' ? 'Gestione sito' : 'Modifica profilo';

  return (
    <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">Connectiamo</Link>

        {user && (
          <div className="hidden md:flex items-center ml-6 gap-3 relative" ref={dropdownRefDesktop}>
            <button
              className="flex items-center gap-2 focus:outline-none hover:bg-yellow-100/10 px-2 py-1 rounded transition"
              onClick={() => setDropdownOpenDesktop((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpenDesktop}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400"
                />
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
              <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpenDesktop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpenDesktop && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-t"
                  onClick={() => { setDropdownOpenDesktop(false); router.push(getDashboardLink()); }}
                >
                  {getDashboardLabel()}
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-b"
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
      </div>
    </nav>
  );
}
