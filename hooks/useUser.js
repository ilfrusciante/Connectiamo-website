
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Errore nel recupero utente:', error);
      setUser(user);
      setLoading(false);
    };

    getUserData();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserData();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
