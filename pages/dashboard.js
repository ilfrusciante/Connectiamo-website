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
      setError("Errore nell'aggiornamento del profilo.");
    } else {
      setMessage('Modifiche salvate con successo!');
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Caricamento...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-white text-xl font-bold mb-4">Area Personale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-white text-sm">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Cognome</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Città</label>
          <input
            type="text"
            name="città"
            value={formData.città}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">CAP</label>
          <input
            type="text"
            name="cap"
            value={formData.cap}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Ruolo</label>
          <input
            type="text"
            name="ruolo"
            value={formData.ruolo}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="text-white text-sm">Descrizione</label>
          <textarea
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="notify_on_message"
            checked={formData.notify_on_message}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-white text-sm">
            Ricevi notifiche email quando ricevi un messaggio
          </label>
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
