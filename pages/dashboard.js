import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;

      setLoading(true);
      let query = supabase.from('profiles').select('*');

      if (role) query = query.eq('role', role);
      if (city) query = query.ilike('city', `%${city}%`);
      if (category) query = query.ilike('category', `%${category}%`);
      if (cap) query = query.ilike('cap', `%${cap}%`);

      const { data, error } = await query;

      if (error) {
        console.error('Errore nel caricamento profili:', error.message);
      } else {
        setProfiles(data);
      }

      setLoading(false);
    };

    fetchProfiles();
  }, [user, role, city, category, cap]);

  if (loading) {
    return <p className="text-center mt-10">Caricamento profili...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 md:px-20">
      <h2 className="text-2xl font-bold mb-6">Risultati per utenti autenticati</h2>
      {profiles.length === 0 ? (
        <p className="text-gray-700">Nessun profilo trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-gray-600">{profile.role} - {profile.category}</p>
              <p className="text-gray-600">{profile.city}, {profile.cap}</p>
              <p className="text-gray-600 mt-2">{profile.description}</p>
              <a
                href={`/chat?to=${profile.id}`}
                className="text-blue-600 mt-4 inline-block font-medium"
              >
                Invia messaggio
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
