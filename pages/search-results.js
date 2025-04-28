import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Head from 'next/head';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!role || !city) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      let query = supabase.from('profiles').select('*');

      if (role) query = query.eq('role', role);
      if (city) query = query.eq('city', city);
      if (cap) query = query.eq('cap', cap);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;

      if (error) {
        setErrorMessage('Errore durante il caricamento dei profili. Riprova più tardi.');
        setProfiles([]);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [role, city, category, cap]);

  return (
    <>
      <Head>
        <title>Risultati Ricerca - Connectiamo</title>
      </Head>

      <main className="bg-white min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Risultati della ricerca</h1>

        {loading ? (
          <p className="text-center">Caricamento...</p>
        ) : errorMessage ? (
          <div className="text-center text-red-500 space-y-4">
            <p>{errorMessage}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded transition"
            >
              Torna alla Home
            </button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Nessun profilo trovato. Prova a cambiare i filtri di ricerca.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded transition"
            >
              Torna alla Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-gray-100 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-blue-900">{profile.username || 'Utente anonimo'}</h2>
                  <p><strong>Ruolo:</strong> {profile.role}</p>
                  <p><strong>Città:</strong> {profile.city}</p>
                  <p><strong>CAP:</strong> {profile.cap || 'Non specificato'}</p>
                  <p><strong>Categoria:</strong> {profile.category || 'Non specificata'}</p>
                  {profile.description && (
                    <p className="text-gray-600 text-sm mt-2">{profile.description}</p>
                  )}
                </div>

                {/* Pulsante contatta */}
                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/messages?to=${profile.id}`)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition"
                  >
                    Contatta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
