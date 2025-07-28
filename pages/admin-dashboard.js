
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profilesCount, setProfilesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || profile.role !== 'Admin') {
        router.push('/');
        return;
      }

      setUser(session.user);
      fetchStats();
    };

    checkAdminAndLoad();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    // Numero totale utenti
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    setProfilesCount(totalUsers || 0);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Amministratore</h1>
      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Totale Utenti Registrati</h2>
            <p className="text-3xl">{profilesCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}
