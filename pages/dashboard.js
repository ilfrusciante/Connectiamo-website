import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Utente non autenticato');
        setLoading(false);
        return;
      }

      console.log('User ID:', user.id); // 🔍 Log ID utente

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !data) {
        console.error('Errore nel recupero del profilo:', profileError);
        setError('Profilo non trovato');
        setLoading(false);
        return;
      }

      console.log('Profilo caricato:', data); // 🔍 Log dati profilo

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Errore aggiornamento profilo:', updateError);
      setError('Errore nell\'aggiornamento del profilo.');
    } else {
      setMessage('Modifiche salvate con successo!');
    }
  };

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-white text-xl font-bold mb-4">Area Personale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['nome', 'cognome', 'nickname', 'città', 'cap', 'ruolo', 'categoria', 'descrizione'].map((field) => (
          <div key={field}>
            <input
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            />
          </div>
        ))}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="notify_on_message"
            checked={formData.notify_on_message}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-white text-sm">Ricevi notifiche email quando ricevi un messaggio</label>
        </div>
        <button type="submit" className="bg-yellow-400 px-4 py-2 rounded">
          Salva Modifiche
        </button>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
