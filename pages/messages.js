import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

const fakeContacts = [
  {
    id: '1',
    nickname: 'muratore92',
    role: 'Professionista',
    category: 'Edilizia',
    city: 'Roma',
    cap: '00100',
    lastMessage: 'Esperto in ristrutturazioni interne ed esterne.',
    unread: 2,
  },
  {
    id: '2',
    nickname: 'contattiMario',
    role: 'Connector',
    category: 'Ristorazione',
    city: 'Milano',
    cap: '20100',
    lastMessage: 'Ho contatti diretti con oltre 20 ristoratori a Milano.',
    unread: 0,
  },
  {
    id: '3',
    nickname: 'dietistaVera',
    role: 'Professionista',
    category: 'Benessere',
    city: 'Torino',
    cap: '10100',
    lastMessage: 'Offro consulenze nutrizionali online e in presenza.',
    unread: 1,
  },
  {
    id: '4',
    nickname: 'Paperino',
    role: 'Connector',
    category: 'Turismo',
    city: 'Milano',
    cap: '00148',
    lastMessage: 'Lavoro con hotel e agenzie per gruppi turistici.',
    unread: 3,
  },
];

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else setUser(user);
    };
    getUser();
  }, [router]);

  if (!user) {
    return <div className="text-center mt-10 text-white">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f1e3c] px-4 py-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Chat privata</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {fakeContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => router.push(`/messages?to=${contact.id}`)}
            className="cursor-pointer bg-[#1e2a44] hover:bg-[#26344f] transition border border-gray-600 p-4 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">{contact.nickname}</h2>
              <p className="text-sm text-gray-300">{contact.role} - {contact.category}</p>
              <p className="text-sm text-gray-400">{contact.city}, {contact.cap}</p>
              <p className="mt-2 text-sm text-white italic line-clamp-1">{contact.lastMessage}</p>
            </div>
            {contact.unread > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {contact.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
