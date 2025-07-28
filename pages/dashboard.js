// pages/dashboard.js

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        router.push('/login');
        return;
      }

      if (data.role === 'Admin') {
        router.push('/admin-dashboard');
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div className="text-white p-4">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Area personale</h1>

      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl space-y-4 shadow-md">
        <p><strong>Nome:</strong> {profile.nome}</p>
        <p><strong>Cognome:</strong> {profile.cognome}</p>
        <p><strong>Nickname:</strong> {profile.nickname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Ruolo:</strong> {profile.role}</p>
        {profile.role === 'Professionista' && (
          <p><strong>Categoria:</strong> {profile.categoria}</p>
        )}
        <p><strong>Città:</strong> {profile.citta}</p>
        <p><strong>CAP:</strong> {profile.cap}</p>
        <p><strong>Descrizione:</strong> {profile.descrizione || '—'}</p>
        <p><strong>Notifiche email:</strong> {profile.notify_on_message ? 'Attive' : 'Disattivate'}</p>

        <button
          className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded"
          onClick={() => router.push('/impostazioni')}
        >
          Modifica profilo
        </button>
      </div>
    </div>
  );
}
