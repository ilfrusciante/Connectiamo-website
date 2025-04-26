import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    if (!role || !city) {
      alert('Seleziona almeno ruolo e città!');
      router.replace('/');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      let query = supabase.from('Profiles').select('*');

      if (role) query = query.eq('role', role);
      if (city) query = query.eq('city', city);
      if (category) query = query.eq('category', category);
      if (cap) query = query.eq('cap', cap);

      const { data, error } = await query;
      if (error) {
        console.error(error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, [router.isReady, role, city, category, cap]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Risultati della ricerca</h1>
      {loading ? (
        <p>Caricamento...</p>
      ) : profiles.length === 0 ? (
        <p>Nessun risultato trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-bold">{profile.username}</h2>
              <p><strong>Ruolo:</strong> {profile.role}</p>
              <p><strong>Città:</strong> {profile.city}</p>
              <p><strong>CAP:</strong> {profile.cap}</p>
              <p><strong>Categoria:</strong> {profile.category}</p>
              <p className="mt-2 text-gray-600">{profile.about}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
