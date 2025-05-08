import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  const fakeContacts = [
    { id: '1', nickname: 'muratore92', message: 'Esperto in ristrutturazioni interne ed esterne.' },
    { id: '2', nickname: 'contattiMario', message: 'Ho contatti diretti con oltre 30 ristoratori a Milano.' },
    { id: '3', nickname: 'dietistaVera', message: 'Offro consulenze nutrizionali online e in presenza.' },
    { id: '4', nickname: 'receptionConnect', message: 'Receptionisti con rete di contatti nel settore turistico.' },
    { id: '5', nickname: 'Paperino', message: 'Connector con contatti nel turismo a Milano.' },
    { id: '6', nickname: 'Pippo', message: 'Professionista nel settore ristorazione a Roma.' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setContacts(fakeContacts); // Sostituisci con fetch reale in futuro
      }
    };
    fetchUser();
  }, [router]);

  if (!user) return <p className="text-center mt-10 text-white">Caricamento...</p>;

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">I tuoi contatti</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => router.push(`/chat?to=${contact.id}`)}
            className="cursor-pointer bg-[#1e2a44] rounded-xl px-6 py-4 shadow hover:bg-[#24304d] transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-yellow-400">{contact.nickname}</h2>
              <span className="text-sm bg-red-600 px-2 py-1 rounded-full">1</span> {/* segnaposto badge */}
            </div>
            <p className="text-gray-300 mt-1 text-sm truncate">{contact.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
