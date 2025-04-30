import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from('profiles').select('*');

        if (role) query = query.eq('role', role);
        if (city) query = query.ilike('city', `%${city}%`);
        if (category) query = query.ilike('category', `%${category}%`);
        if (cap) query = query.ilike('cap', `%${cap}%`);

        const { data, error } = await query;

        if (error) {
          setError(error.message);
        } else {
          setProfiles(data);
        }
      } catch (err) {
        setError('Errore imprevisto durante il caricamento dei profili.');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchProfiles();
    }
  }, [router.isReady, role, city, category, cap]);

  if
