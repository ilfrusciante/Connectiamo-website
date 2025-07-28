// pages/dashboard.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        router.push('/login');
        return;
      }

      if (profile.role === 'Admin') {
        router.push('/admin-dashboard');
        return;
      }

      setUserData(profile);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="text-white text-center mt-10">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Area Personale</h1>
      <div className="bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto space-y-4">
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Cognome:</strong> {userData.cognome}</p>
        <p><strong>Nickname:</strong> {userData.nickname}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Ruolo:</strong> {userData.role}</p>
        <p><strong>Categoria:</strong> {userData.categoria}</p>
        <p><strong>Città:</strong> {userData.citta}</p>
        <p><strong>CAP:</strong> {userData.cap}</p>
        <p><strong>Descrizione:</strong> {userData.descrizione || '—'}</p>
        <p><strong>Notifiche email:</strong> {userData.notify_on_message ? 'Attive' : 'Disattivate'}</p>
      </div>
    </div>
  );
}
