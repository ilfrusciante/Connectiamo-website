import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, read, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Errore caricamento messaggi:', error);
        return;
      }

      const contactMap = {};
      for (const msg of data) {
        const contactId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!contactMap[contactId]) {
          contactMap[contactId] = { unread: 0, lastTime: msg.created_at };
        }
        if (msg.receiver_id === user.id && !msg.read) {
          contactMap[contactId].unread += 1;
        }
      }

      const contactIds = Object.keys(contactMap);
      if (contactIds.length === 0) return;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', contactIds);

      const enriched = profiles.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        unread: contactMap[p.id]?.unread || 0,
        lastTime: contactMap[p.id]?.lastTime,
      }));

      setContacts(enriched.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime)));
    };

    fetchContacts();
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">I tuoi contatti</h1>
      {contacts.length === 0 ? (
        <p className="text-center">Nessuna conversazione trovata.</p>
      ) : (
        <ul className="max-w-xl mx-auto space-y-3">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => router.push(`/chat?user=${contact.id}`)}
              className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <span>{contact.nickname || 'Utente'}</span>
              {contact.unread > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {contact.unread}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
