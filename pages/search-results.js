import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      if (!role || !city) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      let query = supabase.from('Profiles').select('*');

      if (role) query = query.eq('role', role);
      if (city) query = query.eq('city', city);
      if (category) query = query.eq('category', category);
      if (cap) query = query.eq('cap', cap);

      const { data, error } = await query;

      if (error) {
        console.error('Errore nel recupero profili:', error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    }

    if (router.isReady) {
      fetchProfiles();
    }
  }, [router.isReady, role, city, category, cap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!role || !city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Devi selezionare almeno il Ruolo e la Città per effettuare la ricerca.</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Nessun profilo trovato con questi filtri. Prova a cambiare i parametri.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Risultati ricerca</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-blue-700 mb-2">{profile.username}</h2>
            <p className="text-gray-800"><strong>Ruolo:</strong> {profile.role}</p>
            <p className="text-gray-800"><strong>Città:</strong> {profile.city}</p>
            <p className="text-gray-800"><strong>Categoria:</strong> {profile.category}</p>
            <p className="text-gray-800"><strong>CAP:</strong> {profile.cap}</p>
            {profile.about && (
              <p className="text-gray-600 mt-3 text-sm">
                {profile.about.length > 150 ? profile.about.substring(0, 150) + '...' : profile.about}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
