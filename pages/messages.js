import { useEffect, useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../utils/supabaseClient';

export default function Messages() { const router = useRouter(); const [user, setUser] = useState(null); const [contacts, setContacts] = useState([]); const [unreadCounts, setUnreadCounts] = useState({});

useEffect(() => { const fetchUser = async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) router.push('/login'); else setUser(user); }; fetchUser(); }, []);

useEffect(() => { if (!user) return;

const fetchContacts = async () => {
  const { data, error } = await supabase.rpc('get_conversations', {
    current_user_id: user.id,
  });
  if (!error) {
    setContacts(data);
    fetchUnreadCounts(data);
  }
};

const fetchUnreadCounts = async (contactsList) => {
  const { data } = await supabase
    .from('messages')
    .select('sender_id, read')
    .eq('receiver_id', user.id)
    .eq('read', false);

  const counts = {};
  for (const msg of data) {
    counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
  }
  setUnreadCounts(counts);
};

fetchContacts();

}, [user]);

const goToChat = (contactId) => { router.push(/chat?user=${contactId}); };

return ( <div className="max-w-4xl mx-auto px-4 py-10 text-white"> <h1 className="text-3xl font-bold mb-6">I tuoi messaggi</h1> {contacts.length === 0 ? ( <p>Non hai ancora conversazioni.</p> ) : ( <ul className="space-y-3"> {contacts.map((contact) => ( <li key={contact.id} className="bg-[#1e2a44] p-4 rounded-xl shadow flex items-center justify-between cursor-pointer hover:bg-[#26334d]" onClick={() => goToChat(contact.id)} > <div> <p className="font-semibold text-lg">{contact.nickname || 'Utente'}</p> </div> {unreadCounts[contact.id] > 0 && ( <div className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full"> {unreadCounts[contact.id]} </div> )} </li> ))} </ul> )} </div> ); }

