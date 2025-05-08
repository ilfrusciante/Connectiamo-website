import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-[#0f1e3c] text-white px-4 py-4 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300">
        Connectiamo
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              Area personale
            </Link>
            <Link href="/messages" className="hover:underline">
              Messaggi
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Registrati
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
