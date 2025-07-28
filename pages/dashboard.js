import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categorieDisponibili = [
    'Edilizia', 'Benessere', 'Tecnologie', 'Servizi personali',
    'Servizi aziendali', 'Ristorazione', 'Intrattenimento', 'Altro'
  ];

  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    nickname: '',
    città: '',
    cap: '',
    ruolo: '',
    categoria: '',
    descrizione: '',
    notify_on_message: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Utente non autenticato');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setError('Errore nel recupero del profilo');
        setLoading(false);
        return;
      }

      setProfile(data);
      setFormData({
        nome: data.nome || '',
        cognome: data.cognome || '',
        nickname: data.nickname || '',
        città: data.città || '',
        cap: data.cap || '',
        ruolo: data.ruolo || '',
        categoria: data.categoria || '',
        descrizione: data.descrizione || '',
        notify_on_message: data.notify_on_message || false,
      });
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const normalizedCity = formData.città.charAt(0).toUpperCase() + formData.città.slice(1).toLowerCase();
    try {
      const res = await fetch(`https://api.zippopotam.us/it/${formData.cap}`);
      if (!res.ok) throw new Error('CAP non trovato');
      const data = await res.json();
      const cittàValide = data.places.map(p => p['place name']?.toLowerCase() || '');
      const provinceValide = data.places.map(p => p['state abbreviation']?.toLowerCase() || '');

      const matchTrovato = cittàValide.some(
        c => normalizedCity.toLowerCase().includes(c) || c.includes(normalizedCity.toLowerCase())
      ) || provinceValide.includes(normalizedCity.toLowerCase());

      if (!matchTrovato) {
        setError('La città non corrisponde al CAP inserito.');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ ...formData, città: normalizedCity })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Modifiche salvate con successo!');
    } catch (err) {
      console.error(err);
      setError('Errore nell\'aggiornamento del profilo.');
    }
  };

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-white text-xl font-bold mb-4">Area Personale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" className="w-full p-2 rounded bg-white text-black" />
        <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Cognome" className="w-full p-2 rounded bg-white text-black" />
        <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Nickname" className="w-full p-2 rounded bg-white text-black" />
        <input type="text" name="città" value={formData.città} onChange={handleChange} placeholder="Città" className="w-full p-2 rounded bg-white text-black" />
        <input type="text" name="cap" value={formData.cap} onChange={handleChange} placeholder="CAP" className="w-full p-2 rounded bg-white text-black" />

        <select name="ruolo" value={formData.ruolo} onChange={handleChange} className="w-full p-2 rounded bg-white text-black">
          <option value="">Seleziona un ruolo</option>
          <option value="Connector">Connector</option>
          <option value="Professionista">Professionista</option>
        </select>

        <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-2 rounded bg-white text-black">
          <option value="">Seleziona una categoria</option>
          {categorieDisponibili.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrizione" className="w-full p-2 rounded bg-white text-black" />

        <div className="flex items-center">
          <input type="checkbox" name="notify_on_message" checked={formData.notify_on_message} onChange={handleChange} className="mr-2" />
          <label className="text-white text-sm">Ricevi notifiche email quando ricevi un messaggio</label>
        </div>

        <button type="submit" className="bg-yellow-400 px-4 py-2 rounded">Salva Modifiche</button>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
