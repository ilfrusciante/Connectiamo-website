
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifiche</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((note, index) => (
              <li key={index} className="bg-yellow-100 dark:bg-gray-800 p-4 rounded shadow">
                <p className="text-sm">{note.message}</p>
                <span className="text-xs text-gray-600 dark:text-gray-400">{new Date(note.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessuna notifica disponibile.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
