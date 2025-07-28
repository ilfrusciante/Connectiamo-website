import { useEffect, useState } from 'react'; import { supabase } from '../utils/supabaseClient'; import { useUser } from '@supabase/auth-helpers-react';

export default function Dashboard() { const user = useUser(); const [formData, setFormData] = useState({ nome: '', cognome: '', nickname: '', citta: '', cap: '', ruolo: '', categoria: '', descrizione: '', notify_on_message: false, }); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);

const categorie = [ 'Edilizia', 'Benessere', 'Tecnologie', 'Servizi personali', 'Servizi aziendali', 'Ristorazione', 'Intrattenimento', 'Altro', ];

useEffect(() => { if (user) fetchProfile(); }, [user]);

async function fetchProfile() { const { data, error } = await supabase .from('profiles') .select('*') .eq('id', user.id) .single(); if (data) setFormData(data); }

async function handleSubmit(e) { e.preventDefault(); setMessage(''); setLoading(true);

const cityNormalized = formData.citta.charAt(0).toUpperCase() + formData.citta.slice(1).toLowerCase();

try {
  const res = await fetch(`https://api.zippopotam.us/it/${formData.cap}`);
  if (!res.ok) throw new Error('CAP non valido');
  const json = await res.json();
  const cityMatch = json.places.some(p =>
    p['place name'].toLowerCase().includes(formData.citta.toLowerCase()) ||
    p['state'].toLowerCase().includes(formData.citta.toLowerCase())
  );
  if (!cityMatch) throw new Error('La città non corrisponde al CAP');

  const updates = {
    ...formData,
    citta: cityNormalized,
    updated_at: new Date(),
  };

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) throw error;
  setMessage('Profilo aggiornato con successo.');
} catch (err) {
  setMessage(err.message);
} finally {
  setLoading(false);
}

}

function handleChange(e) { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value, })); }

return ( <div className="p-4 max-w-xl mx-auto text-white"> <h2 className="text-lg font-bold mb-4">Area Personale</h2> <form onSubmit={handleSubmit} className="flex flex-col space-y-3"> <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" className="p-2 rounded text-black" /> <input name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Cognome" className="p-2 rounded text-black" /> <input name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Nickname" className="p-2 rounded text-black" /> <input name="citta" value={formData.citta} onChange={handleChange} placeholder="Città" className="p-2 rounded text-black" /> <input name="cap" value={formData.cap} onChange={handleChange} placeholder="CAP" className="p-2 rounded text-black" />

<select name="ruolo" value={formData.ruolo} onChange={handleChange} className="p-2 rounded text-black">
      <option value="">Seleziona un ruolo</option>
      <option value="Connector">Connector</option>
      <option value="Professionista">Professionista</option>
    </select>

    <select name="categoria" value={formData.categoria} onChange={handleChange} className="p-2 rounded text-black">
      <option value="">Seleziona una categoria</option>
      {categorie.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>

    <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrizione" className="p-2 rounded text-black" />

    <label className="flex items-center">
      <input
        type="checkbox"
        name="notify_on_message"
        checked={formData.notify_on_message}
        onChange={handleChange}
        className="mr-2"
      />
      Ricevi notifiche email quando ricevi un messaggio
    </label>

    <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded">
      {loading ? 'Salvataggio...' : 'Salva Modifiche'}
    </button>

    {message && <p className={message.includes('errore') || message.includes('Error') ? 'text-red-500' : 'text-green-500'}>{message}</p>}
  </form>
</div>

); }

