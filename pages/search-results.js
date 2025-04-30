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

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700">Caricamento dei profili in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Errore nel caricamento dei profili: {error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-yellow-400 px-4 py-2 rounded-md font-semibold"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700 text-lg">Nessun profilo trovato con i criteri di ricerca.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-yellow-400 px-4 py-2 rounded-md font-semibold"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 md:px-20">
      <h2 className="text-2xl font-bold mb-6">Risultati della ricerca</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600">{profile.role} - {profile.category}</p>
            <p className="text-gray-600">{profile.city}, {profile.cap}</p>
            <p className="text-gray-600 mt-2">{profile.description}</p>
            <a href={`mailto:${profile.email}`} className="text-blue-600 mt-4 inline-block">Contatta</a>
          </div>
        ))}
      </div>
    </div>
  );
}
