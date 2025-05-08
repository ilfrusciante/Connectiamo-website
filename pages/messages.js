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

    // Contatti finti visibili sempre
    const fakeContacts = [
      { id: 'fake1', nickname: 'muratore92', unread: 0 },
      { id: 'fake2', nickname: 'contattiMario', unread: 1 },
      { id: 'fake3', nickname: 'guidaRomaCentro', unread: 0 },
    ];

    setContacts(fakeContacts);
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
              <span>{contact.nickname}</span>
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
