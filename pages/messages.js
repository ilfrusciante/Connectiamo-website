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
      if (!user) router.push('/login');
      else setUser(user);
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
    if (!error && data) setContacts(data);
  };

  const handleClick = (contactId) => {
    router.push(`/chat?to=${contactId}`);
  };

  const deleteContact = async (contactId) => {
    await supabase
      .from('deleted_contacts')
      .insert({ user_id: user.id, deleted_user_id: contactId });
    fetchContacts();
  };

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
                <div onClick={() => handleClick(contact.id)} className="cursor-pointer w-full">
                  <p className="text-lg font-semibold text-yellow-400">{contact.nickname || 'Utente anonimo'}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {contact.last_message?.substring(0, 60) || 'Nessun messaggio disponibile'}
                  </p>
                  {contact.unread_count > 0 && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full mt-2 inline-block">
                      {contact.unread_count} nuovi
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="ml-4 text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                  Elimina
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
