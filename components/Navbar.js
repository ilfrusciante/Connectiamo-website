import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const notificationAudio = useRef(null);
  const [dropdownOpenDesktop, setDropdownOpenDesktop] = useState(false);
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
  const router = useRouter();
  const dropdownRefDesktop = useRef();
  const dropdownRefMobile = useRef();

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
        // Recupera nickname e avatar dal profilo
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, avatar_url')
          .eq('id', user.id)
          .single();
        if (profile && profile.nickname) setNickname(profile.nickname);
        if (profile && profile.avatar_url) setAvatar(profile.avatar_url);
        else setAvatar('');
        // Recupera conteggio messaggi non letti
        const { data: contacts, error } = await supabase.rpc('get_conversations', {
          current_user_id: user.id,
        });
        if (!error && contacts) {
          const totalUnread = contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
          setPrevUnreadCount((prev) => {
            if (totalUnread > prev && notificationAudio.current) {
              notificationAudio.current.currentTime = 0;
              notificationAudio.current.play();
            }
            return totalUnread;
          });
          setUnreadCount(totalUnread);
        }
      } else {
        setNickname('');
        setAvatar('');
        setUnreadCount(0);
        setPrevUnreadCount(0);
      }
    };
    checkUser();

    // Listener per login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    // Listener realtime per nuovi messaggi e aggiornamenti di lettura
    let messageSub = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        messageSub = supabase
          .channel('messages-unread-badge')
          .on('postgres_changes', {
            event: '*', // ascolta sia INSERT che UPDATE che DELETE
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          }, () => {
            checkUser(); // aggiorna badge
          })
          .subscribe();
      }
    });

    // Listener custom event per aggiornare subito il badge
    const handleUpdateBadge = () => checkUser();
    window.addEventListener('update-unread-badge', handleUpdateBadge);

    return () => {
      listener?.subscription.unsubscribe();
      if (messageSub) supabase.removeChannel(messageSub);
      window.removeEventListener('update-unread-badge', handleUpdateBadge);
    };
  }, []);

  return (
    <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <audio ref={notificationAudio} src="/notification.mp3" preload="auto" />
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">Connectiamo</Link>
        {/* Mostra avatar e nickname se loggato (desktop) */}
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
                  className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400 cursor-pointer hover:scale-105 transition"
                  style={{ minWidth: 36, minHeight: 36 }}
                />
              ) : (
                <span className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900 cursor-pointer">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                    <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                  </svg>
                </span>
              )}
              <span className="text-yellow-300 font-semibold cursor-pointer">
                {nickname ? `Ciao, ${nickname}!` : 'Utente'}
              </span>
              <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpenDesktop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpenDesktop && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-t"
                  onClick={() => { setDropdownOpenDesktop(false); router.push('/dashboard'); }}
                >
                  Modifica profilo
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
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          {user ? (
            <>
              <Link href="/messages" className="hover:text-yellow-400 flex items-center gap-1">
                Messaggi
                {unreadCount > 0 && (
                  <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-400">Login</Link>
              <Link href="/signup" className="hover:text-yellow-400">Registrati</Link>
            </>
          )}
        </div>
        {/* Mostra avatar e nickname se loggato (mobile) */}
        {user && (
          <div className="md:hidden flex items-center ml-4 gap-2 relative" ref={dropdownRefMobile}>
            <button
              className="flex items-center gap-2 focus:outline-none hover:bg-yellow-100/10 px-2 py-1 rounded transition"
              onClick={() => setDropdownOpenMobile((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpenMobile}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 cursor-pointer hover:scale-105 transition"
                  style={{ minWidth: 32, minHeight: 32 }}
                />
              ) : (
                <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900 cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                    <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                  </svg>
                </span>
              )}
              <span className="text-yellow-300 font-semibold cursor-pointer">
                {nickname ? nickname : 'Utente'}
              </span>
              <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpenMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpenMobile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-t"
                  onClick={() => { setDropdownOpenMobile(false); router.push('/dashboard'); }}
                >
                  Modifica profilo
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-b"
                  onClick={() => { setDropdownOpenMobile(false); router.push('/logout'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
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
        <div className="md:hidden mt-3 flex flex-col gap-4 px-2">
          <Link href="/" className="block hover:text-yellow-400 text-lg py-3 rounded">Home</Link>
          {user ? (
            <>
              <Link href="/messages" className="block hover:text-yellow-400 flex items-center gap-2 text-lg py-3 rounded">
                Messaggi
                {unreadCount > 0 && (
                  <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
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
