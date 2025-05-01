import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const searchParams = new URLSearchParams(window.location.search);
      const role = searchParams.get('role');
      const city = searchParams.get('city');
      const category = searchParams.get('category');
      const cap = searchParams.get('cap');

      let query = supabase.from('profiles').select('*');

      if (role) query = query.eq('role', role);
      if (city) query = query.ilike('city', `%${city}%`);
      if (category) query = query.ilike('category', `%${category}%`);
      if (cap) query = query.ilike('cap', `%${cap}%`);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setProfiles(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Caricamento...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Errore: {error}</p>
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
      <h2 className="text-2xl font-bold mb-6">Dashboard: Risultati ricerca</h2>
      {profiles.length === 0 ? (
        <p>Nessun profilo trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-gray-600">{profile.role} - {profile.category}</p>
              <p className="text-gray-600">{profile.city}, {profile.cap}</p>
              <p className="text-gray-600 mt-2">{profile.description}</p>
              <p className="mt-4 text-gray-400 italic">Per contattare questo utente, accedi alla messaggistica interna.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
