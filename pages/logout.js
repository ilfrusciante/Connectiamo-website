import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/');
    };
    logout();
  }, [router]);

  return <p className="text-center p-4 text-white">Disconnessione in corso...</p>;
}
