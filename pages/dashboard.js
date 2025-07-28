import { useState, useEffect } from 'react'; import { supabase } from '../utils/supabaseClient'; import { useRouter } from 'next/router';

export default function Dashboard() { const router = useRouter(); const [profile, setProfile] = useState({ nome: '', cognome: '', nickname: '', citta: '', cap: '', ruolo: '', categoria: '', descrizione: '', notify_on_message: false, }); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');

useEffect(() => { const fetchProfile = async () => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase .from('profiles') .select('*') .eq('id', user.id) .single();

if (error) {
    console.error('Errore nel recupero profilo:', error);
  } else {
    setProfile(data);
  }
  setLoading(false);
};

fetchProfile();

}, []);

const handleChange = (e) => { const { name, value, type, checked } = e.target; setProfile((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value, })); };

const handleSave = async () => { setMessage(''); const { data: { user } } = await supabase.auth.getUser();

// Normalizzazione città
const city = profile.citta.charAt(0).toUpperCase() + profile.citta.slice(1).toLowerCase();

// Verifica CAP ↔ città
const response = await fetch(`https://api.zippopotam.us/it/${profile.cap}`);
if (!response.ok) {
  setMessage('❌ CAP non valido.');
  return;
}
const zipData = await response.json();
const matches = zipData.places.some(p =>
  p['place name'].toLowerCase().includes(profile.citta.toLowerCase()) ||
  (p['admin name2'] && p['admin name2'].toLowerCase().includes(profile.citta.toLowerCase()))
);
if (!matches) {
  setMessage('❌ Il CAP non corrisponde alla città.');
  return;
}

const updates = {
  ...profile,
  id: user.id,
  citta: city,
};

const { error } = await supabase.from('profiles').upsert(updates);
if (error) {
  console.error('Errore salvataggio:', error);
  setMessage('❌ Errore nell\'aggiornamento del profilo.');
} else {
  setMessage('✅ Profilo aggiornato con successo.');
}

};

if (loading) return <p>Caricamento...</p>;

return ( <div className="max-w-xl mx-auto p-4"> <h1 className="text-xl font-bold mb-4">Area Personale</h1> <div className="space-y-3"> <input name="nome" value={profile.nome} onChange={handleChange} placeholder="Nome" className="w-full p-2 rounded" /> <input name="cognome" value={profile.cognome} onChange={handleChange} placeholder="Cognome" className="w-full p-2 rounded" /> <input name="nickname" value={profile.nickname} onChange={handleChange} placeholder="Nickname" className="w-full p-2 rounded" /> <div className="flex gap-2"> <input name="citta" value={profile.citta} onChange={handleChange} placeholder="Città" className="w-full p-2 rounded" /> <input name="cap" value={profile.cap} onChange={handleChange} placeholder="CAP" className="w-28 p-2 rounded" /> </div> <select name="ruolo" value={profile.ruolo} onChange={handleChange} className="w-full p-2 rounded"> <option value="">Seleziona ruolo</option> <option value="Connector">Connector</option> <option value="Professionista">Professionista</option> <option value="Admin">Admin</option> </select> <input name="categoria" value={profile.categoria} onChange={handleChange} placeholder="Categoria" className="w-full p-2 rounded" /> <textarea name="descrizione" value={profile.descrizione} onChange={handleChange} placeholder="Descrizione" className="w-full p-2 rounded" rows={3} /> <label className="flex items-center"> <input type="checkbox" name="notify_on_message" checked={profile.notify_on_message} onChange={handleChange} className="mr-2" /> Ricevi notifiche email quando ricevi un messaggio </label> <button onClick={handleSave} className="bg-yellow-400 px-4 py-2 rounded">Salva Modifiche</button> {message && <p className="mt-2 text-sm">{message}</p>} </div> </div> ); }

