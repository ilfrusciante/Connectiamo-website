
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function useAuth(redirectTo = null) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user && redirectTo) {
        router.push(redirectTo);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && redirectTo) {
        router.push(redirectTo);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [redirectTo]);

  return { user, loading };
}
