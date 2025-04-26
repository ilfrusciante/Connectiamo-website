// pages/search-results.js

import { useRouter } from 'next/router'; import { useEffect, useState } from 'react'; import { supabase } from '@/utils/supabaseClient';

export default function SearchResults() { const router = useRouter(); const { role, city, cap, category } = router.query; const [profiles, setProfiles] = useState([]); const [loading, setLoading] = useState(true);

useEffect(() => { if (!role || !city) return; // Non cercare se non ci sono i dati obbligatori

const fetchProfiles = async () => {
  setLoading(true);
  let query = supabase.from('Profiles').select('*');

  if (role) {
    query = query.eq('role', role);
  }
  if (city) {
    query = query.eq('city', city);
  }
  if (cap) {
    query = query.eq('cap', cap);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Errore nel recupero dei profili:', error.message);
  } else {
    setProfiles(data);
  }
  setLoading(false);
};

fetchProfiles();

}, [role, city, cap, category]);

if (!role || !city) { return ( <div className="min-h-screen flex items-center justify-center text-center"> <div> <h2 className="text-2xl font-semibold text-red-600">Errore: seleziona almeno Ruolo e Città</h2> </div> </div> ); }

return ( <div className="min-h-screen py-10 px-4 md:px-20"> <h1 className="text-3xl font-bold mb-8">Risultati della Ricerca</h1> {loading ? ( <p>Caricamento...</p> ) : profiles.length === 0 ? ( <p>Nessun profilo trovato.</p> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {profiles.map((profile) => ( <div key={profile.id} className="bg-white rounded-lg shadow p-6"> <h2 className="text-xl font-semibold mb-2">{profile.username}</h2> <p className="text-gray-600"><strong>Ruolo:</strong> {profile.role}</p> <p className="text-gray-600"><strong>Città:</strong> {profile.city}</p> <p className="text-gray-600"><strong>CAP:</strong> {profile.cap}</p> <p className="text-gray-600"><strong>Categoria:</strong> {profile.category}</p> {profile.about && ( <p className="text-gray-700 mt-2">{profile.about}</p> )} </div> ))} </div> )} </div> ); }

