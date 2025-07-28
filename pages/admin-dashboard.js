// pages/admin-dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    dailyRegistrations: 0,
    weeklyRegistrations: 0,
    monthlyRegistrations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push('/login');
        return;
      }

      // Verifica se l'utente è admin (puoi modificare la logica come preferisci)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'Admin') {
        router.push('/');
        return;
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
      const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();

      const [all, daily, weekly, monthly, online] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('profiles').select('*').gte('created_at', today),
        supabase.from('profiles').select('*').gte('created_at', sevenDaysAgo),
        supabase.from('profiles').select('*').gte('created_at', oneMonthAgo),
        supabase.from('profiles').select('*').gte('last_seen', fiveMinutesAgo),
      ]);

      setStats({
        totalUsers: all.data?.length || 0,
        dailyRegistrations: daily.data?.length || 0,
        weeklyRegistrations: weekly.data?.length || 0,
        monthlyRegistrations: monthly.data?.length || 0,
        onlineUsers: online.data?.length || 0,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Amministratore</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Totale Utenti Registrati" value={stats.totalUsers} />
        <Card title="Utenti Online (ultimi 5 min)" value={stats.onlineUsers} />
        <Card title="Registrazioni Oggi" value={stats.dailyRegistrations} />
        <Card title="Registrazioni Ultimi 7 Giorni" value={stats.weeklyRegistrations} />
        <Card title="Registrazioni Ultimo Mese" value={stats.monthlyRegistrations} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 text-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold text-yellow-400">{value}</p>
    </div>
  );
}
