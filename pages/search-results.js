import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, cap, category } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!role || !city) {
        alert('Seleziona almeno ruolo e città!');
        router.push('/');
        return;
      }

      let query = supabase
        .from('Profiles')
        .select('*')
        .eq('role', role)
        .eq('city', city);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Errore nel caricamento dei dati:', error);
      } else {
        setProfiles(data);
      }

      setLoading(false);
    };

    if (role && city) {
      fetchProfiles();
    }
  }, [role, city, category, cap, router]);

  return (
    <main className="bg-white min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risultati della ricerca</h1>

        {loading ? (
          <p>Caricamento...</p>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{profile.username}</h2>
                <p><strong>Ruolo:</strong> {profile.role}</p>
                <p><strong>Città:</strong> {profile.city}</p>
                <p><strong>Categoria:</strong> {profile.category}</p>
                <p><strong>CAP:</strong> {profile.cap}</p>
                <p><strong>Descrizione:</strong> {profile.about}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nessun profilo trovato per i criteri selezionati.</p>
        )}
      </div>
    </main>
  );
}
