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
    if (user) fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id,
    });

    if (!error && data) {
      setContacts(data);
    }
  };

  const handleClick = async (contactId) => {
    // Verifica o crea un primo messaggio se non esiste
    const { data: existing } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .eq('receiver_id', contactId);

    if (!existing || existing.length === 0) {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: contactId,
        content: '',
      });
    }

    router.push(`/chat?to=${contactId}`);
  };

  if (!user) {
    return <p className="text-center mt-10 text-white">Caricamento...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">I tuoi contatti</h1>
        {contacts.length === 0 ? (
          <p className="text-center text-gray-300">Non hai ancora messaggiato con nessuno.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleClick(contact.id)}
                className="bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg px-5 py-4 transition flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-yellow-400">{contact.nickname || 'Utente anonimo'}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {contact.last_message?.substring(0, 60) || 'Nessun messaggio disponibile'}
                  </p>
                </div>
                {contact.last_message_time && (
                  <p className="text-xs text-gray-400">
                    {new Date(contact.last_message_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
