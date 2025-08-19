import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

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

  const handleContact = async (receiverId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Non è necessario creare un messaggio vuoto per iniziare una conversazione
    // La conversazione verrà creata automaticamente quando verrà inviato il primo messaggio reale

    router.push(`/chat?to=${receiverId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">Caricamento dei profili in corso...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-white">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-yellow-400 px-4 py-2 rounded font-semibold text-black"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center mt-10 text-white">
        <p className="text-lg">Nessun profilo trovato con i criteri di ricerca.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-yellow-400 px-4 py-2 rounded font-semibold text-black"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 md:px-20 text-white">
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded shadow"
      >
        ← Torna indietro
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center">Risultati della ricerca</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-[#1e2a44] p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400">
              {profile.nickname || 'Utente anonimo'}
            </h3>

            <p className="text-gray-300 mt-1">{profile.role} • {profile.category || 'Categoria non specificata'}</p>
            <p className="text-gray-400 text-sm">{profile.city}{profile.cap ? `, ${profile.cap}` : ''}</p>
            {profile.description && (
              <p className="mt-3 text-gray-200 text-sm">{profile.description}</p>
            )}

            {user ? (
              <button
                onClick={() => handleContact(profile.id)}
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition"
              >
                Contatta
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Accedi per contattare
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
