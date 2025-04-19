
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ProfileCard from '../components/ProfileCard';

export default function MatchPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error) {
        setProfiles(data);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Trova professionisti compatibili
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">Nessun profilo trovato.</p>
        )}
      </div>
    </div>
  );
}
