import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const { role, city, category, cap } = router.query;

  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      if (!error) setProfiles(data);
      setLoading(false);
    };
    fetchProfiles();
  }, [user, role, city, category, cap]);

  const goToProfileEdit = () => router.push('/modifica-profilo');
  const goToBlocked = () => router.push('/dashboard/bloccati');
  const goToDeleted = () => router.push('/dashboard/cancellati');
  const goToSubscription = () => router.push('/dashboard/abbonamento');

  if (loading) return <p className="text-center mt-10">Caricamento profili...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 md:px-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Area personale</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={goToProfileEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded">
            Modifica Profilo
          </button>
          <button onClick={goToBlocked} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
            Contatti Bloccati
          </button>
          <button onClick={goToDeleted} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded">
            Contatti Cancellati
          </button>
          <button onClick={goToSubscription} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">
            Abbonamento
          </button>
        </div>
      </div>

      {profiles.length === 0 ? (
        <p className="text-gray-400">Nessun profilo trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-gray-800">{profile.nickname}</h3>
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
