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

  const fetchContacts = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id,
    });

    if (!error && data) {
      setContacts(data);
    }
  };

  const handleClick = async (contactId) => {
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

  const handleDelete = async (contactId) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`);

    if (!error) {
      fetchContacts();
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-white">Caricamento...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white">
      {/* NAVBAR */}
      <nav className="bg-[#0f1e3c] border-b border-gray-800 px-4 py-3 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer hover:text-yellow-400">Connectiamo</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/"><a className="hover:text-yellow-400">Home</a></Link>
            <Link href="/dashboard"><a className="hover:text-yellow-400">Area personale</a></Link>
            <Link href="/messages"><a className="hover:text-yellow-400">Messaggi</a></Link>
            <Link href="/logout"><a className="hover:text-yellow-400">Logout</a></Link>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? '✖' : '☰'}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-2">
            <Link href="/"><a className="block hover:text-yellow-400">Home</a></Link>
            <Link href="/dashboard"><a className="block hover:text-yellow-400">Area personale</a></Link>
            <Link href="/messages"><a className="block hover:text-yellow-400">Messaggi</a></Link>
            <Link href="/logout"><a className="block hover:text-yellow-400">Logout</a></Link>
          </div>
        )}
      </nav>

      {/* CONTATTI */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Messaggi</h1>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-300">Non hai ancora messaggiato con nessuno.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-gray-800 rounded-lg px-5 py-4 transition flex justify-between items-center"
              >
                <div className="cursor-pointer" onClick={() => handleClick(contact.id)}>
                  <p className="text-lg font-semibold text-yellow-400">{contact.nickname || 'Utente anonimo'}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {contact.last_message?.substring(0, 60) || 'Nessun messaggio disponibile'}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  {contact.unread_count > 0 && (
                    <span className="text-xs bg-yellow-400 text-black rounded-full px-2 py-0.5">
                      {contact.unread_count}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
