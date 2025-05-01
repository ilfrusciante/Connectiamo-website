// File: pages/dashboard.js import { useEffect, useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../lib/supabaseClient'; import Link from 'next/link';

export default function Dashboard() { const router = useRouter(); const [profiles, setProfiles] = useState([]); const [loading, setLoading] = useState(true); const [userId, setUserId] = useState(null);

const { role, city, cap, category } = router.query;

useEffect(() => { const getUser = async () => { const { data: { user }, error, } = await supabase.auth.getUser(); if (user) setUserId(user.id); }; getUser(); }, []);

useEffect(() => { const fetchProfiles = async () => { if (!role || !city) return; const { data, error } = await supabase .from('profiles') .select('*') .ilike('role', %${role}%) .ilike('city', %${city}%) .ilike('cap', %${cap || ''}%) .ilike('category', %${category || ''}%);

if (error) console.error('Errore nel caricamento:', error);
  else setProfiles(data);
  setLoading(false);
};
fetchProfiles();

}, [role, city, cap, category]);

const handleContact = async (recipientId) => { if (!userId) return; const { error } = await supabase.from('messages').insert({ sender_id: userId, recipient_id: recipientId, content: 'Ciao, vorrei mettermi in contatto con te tramite Connectiamo.', }); if (!error) alert('Messaggio inviato!'); else alert('Errore durante l'invio del messaggio.'); };

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">Risultati della tua ricerca</h1> {loading ? ( <p>Caricamento...</p> ) : profiles.length > 0 ? ( <ul className="space-y-4"> {profiles.map((profile) => ( <li key={profile.id} className="border p-4 rounded"> <p><strong>Nome:</strong> {profile.full_name}</p> <p><strong>Ruolo:</strong> {profile.role}</p> <p><strong>Città:</strong> {profile.city}</p> <p><strong>Categoria:</strong> {profile.category}</p> <button onClick={() => handleContact(profile.id)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" > Contatta </button> </li> ))} </ul> ) : ( <p>Nessun profilo trovato.</p> )} </div> ); }

