import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, cap, category } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role || !city) {
      alert('Seleziona almeno ruolo e città!');
      router.push('/');
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      let query = supabase.from('Profiles').select('*')
        .ilike('role', `%${role}%`)
        .ilike('city', `%${city}%`);

      if (cap) {
        query = query.ilike('cap', `%${cap}%`);
      }

      if (category) {
        query = query.ilike('category', `%${category}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Errore nel caricamento dei dati:', error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [role, city, cap, category, router]);

  return (
    <main className="bg-gray-100 min-h-screen py-12 px-6 md:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Risultati della ricerca</h1>

      {loading ? (
        <p className="text-center text-gray-600">Caricamento...</p>
      ) : profiles.length === 0 ? (
        <p className="text-center text-gray-600">Nessun risultato trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{profile.username || 'Utente anonimo'}</h2>
              <p className="text-gray-700"><strong>Ruolo:</strong> {profile.role}</p>
              <p className="text-gray-700"><strong>Città:</strong> {profile.city}</p>
              <p className="text-gray-700"><strong>CAP:</strong> {profile.cap}</p>
              <p className="text-gray-700"><strong>Categoria:</strong> {profile.category}</p>
              {profile.about && (
                <p className="text-gray-600 mt-4">{profile.about}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
