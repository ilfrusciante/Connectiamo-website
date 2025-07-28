import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
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

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
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

      if (error) {
        setError('Errore nel recupero del profilo');
        setLoading(false);
        return;
      }

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

    const { data: { user } } = await supabase.auth.getUser();

    // Controllo CAP ↔ città via API Zippopotam.us
    const cap = formData.cap.trim();
    const città = formData.città.trim().toLowerCase();

    try {
      const res = await fetch(`https://api.zippopotam.us/it/${cap}`);
      const data = await res.json();

      const match = data.places?.some(
        (place) =>
          place['place name'].toLowerCase().includes(città) ||
          place['state'].toLowerCase().includes(città)
      );

      if (!match) {
        setError(`Il CAP ${cap} non corrisponde alla città ${formData.città}`);
        return;
      }
    } catch (err) {
      setError('Errore durante la verifica del CAP e città');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id);

    if (updateError) {
      setError('Errore durante il salvataggio');
    } else {
      setMessage('Modifiche salvate con successo!');
    }
  };

  if (loading) return <p className="text-white p-4">Caricamento...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-white text-xl font-bold mb-4">Area Personale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nome */}
        <div>
          <label className="text-white text-sm block mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* Cognome */}
        <div>
          <label className="text-white text-sm block mb-1">Cognome</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* Nickname */}
        <div>
          <label className="text-white text-sm block mb-1">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* Città */}
        <div>
          <label className="text-white text-sm block mb-1">Città</label>
          <input
            type="text"
            name="città"
            value={formData.città}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* CAP */}
        <div>
          <label className="text-white text-sm block mb-1">CAP</label>
          <input
            type="text"
            name="cap"
            value={formData.cap}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* Ruolo */}
        <div>
          <label className="text-white text-sm block mb-1">Ruolo</label>
          <select
            name="ruolo"
            value={formData.ruolo}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Seleziona un ruolo</option>
            <option value="Professionista">Professionista</option>
            <option value="Connector">Connector</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Categoria (solo se Professionista) */}
        {formData.ruolo === 'Professionista' && (
          <div>
            <label className="text-white text-sm block mb-1">Categoria</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="">Seleziona una categoria</option>
              <option value="Turismo">Turismo</option>
              <option value="Ristorazione">Ristorazione</option>
              <option value="Benessere">Benessere</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
        )}

        {/* Descrizione */}
        <div>
          <label className="text-white text-sm block mb-1">Descrizione</label>
          <textarea
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        {/* Checkbox notifica email */}
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

        {message && <p className="text-green-400 mt-2">{message}</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </div>
  );
}
