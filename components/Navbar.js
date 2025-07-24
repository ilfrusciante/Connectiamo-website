import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Recupera nickname e avatar dal profilo
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, avatar')
          .eq('id', user.id)
          .single();
        if (profile && profile.nickname) setNickname(profile.nickname);
        if (profile && profile.avatar) setAvatar(profile.avatar);
        else setAvatar('');
        // Recupera conteggio messaggi non letti
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
        setUnreadCount(0);
      }
    };
    checkUser();

    // Listener per login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">Connectiamo</Link>
        {/* Mostra avatar e nickname se loggato (desktop) */}
        {user && (
          <div className="hidden md:flex items-center ml-6 gap-3">
            <Link href="/dashboard">
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
            </Link>
            <span className="text-yellow-300 font-semibold">
              {nickname ? `Ciao, ${nickname}!` : 'Utente'}
            </span>
          </div>
        )}
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-yellow-400">Area personale</Link>
              <Link href="/messages" className="hover:text-yellow-400 flex items-center gap-1">
                Messaggi
                {unreadCount > 0 && (
                  <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/logout" className="hover:text-yellow-400">Logout</Link>
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
          <div className="md:hidden flex items-center ml-4 gap-2">
            <Link href="/dashboard">
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
            </Link>
            <span className="text-yellow-300 font-semibold">
              {nickname ? nickname : 'Utente'}
            </span>
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
              <Link href="/dashboard" className="block hover:text-yellow-400 text-lg py-3 rounded">Area personale</Link>
              <Link href="/messages" className="block hover:text-yellow-400 flex items-center gap-2 text-lg py-3 rounded">
                Messaggi
                {unreadCount > 0 && (
                  <span className="ml-1 bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/logout" className="block hover:text-yellow-400 text-lg py-3 rounded">Logout</Link>
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
