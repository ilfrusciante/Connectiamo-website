import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchContacts();
    }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const messagesChannel = supabase
      .channel(`messages-realtime-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or=(receiver_id.eq.${user.id},sender_id.eq.${user.id})`
      }, () => {
        fetchContacts();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(messagesChannel);
    };
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
    router.push(`/chat?to=${contactId}`);
  };

  const handleDelete = async (contactId) => {
    const { error } = await supabase
      .from('deleted_contacts')
      .insert({ user_id: user.id, contact_id: contactId });

    if (!error) {
      setContacts(contacts.filter((c) => c.id !== contactId));
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-white">Caricamento...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white">
      {/* CONTATTI */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Messaggi</h1>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-300">Non hai ancora messaggiato con nessuno.</p>
        ) : (
          <div className="space-y-4">
            {contacts.filter(contact => contact.last_message && contact.last_message.trim() !== '').map((contact) => (
              <div
                key={contact.id}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-4 transition"
              >
                <div className="flex justify-between items-center">
                  <div onClick={() => handleClick(contact.id)} className="cursor-pointer w-full flex items-center gap-3">
                    {contact.avatar_url ? (
                      <img
                        src={contact.avatar_url}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                        style={{ minWidth: 48, minHeight: 48 }}
                      />
                    ) : (
                      <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900">
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                          <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                        </svg>
                      </span>
                    )}
                    <div>
                      <p className="text-lg font-semibold text-yellow-400">{contact.nickname || 'Utente anonimo'}</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {contact.last_message?.substring(0, 60) || 'Nessun messaggio disponibile'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {contact.unread_count > 0 && (
                      <span className="bg-yellow-400 text-black rounded-full px-2 text-xs font-bold">
                        {contact.unread_count}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
