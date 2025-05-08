import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id,
    });

    if (!error) {
      setContacts(data);
    }
  };

  const openChat = (contactId) => {
    router.push(`/messages?to=${contactId}`);
  };

  if (!user) {
    return <p className="text-center mt-10 text-white">Caricamento...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">I tuoi contatti</h1>
        {contacts.length === 0 ? (
          <p className="text-center text-gray-300">Non hai ancora messaggiato con nessuno.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => openChat(contact.id)}
                className="bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-lg font-semibold text-yellow-400">{contact.nickname}</p>
                  <p className="text-sm text-gray-300">
                    {contact.last_message?.substring(0, 60) || 'Nessun messaggio disponibile'}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {contact.last_message_time
                    ? new Date(contact.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
