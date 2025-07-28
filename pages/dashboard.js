import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    nickname: '',
    city: '',
    cap: '',
    role: '',
    category: '',
    description: '',
    notify_on_message: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
          setForm({
            name: data.name || '',
            surname: data.surname || '',
            nickname: data.nickname || '',
            city: data.city || '',
            cap: data.cap || '',
            role: data.role || '',
            category: data.category || '',
            description: data.description || '',
            notify_on_message: data.notify_on_message || false
          });
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id);

    if (!error) alert('Profilo aggiornato con successo!');
    else alert('Errore nell\'aggiornamento del profilo');
  };

  if (!profile) return <p className="text-white text-center mt-10">Caricamento profilo...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Area Personale</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block mb-1 text-sm">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Cognome</label>
          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Città</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full bg-white text-black rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">CAP</label>
            <input
              type="text"
              name="cap"
              value={form.cap}
              onChange={handleChange}
              className="w-full bg-white text-black rounded px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm">Ruolo</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          >
            <option value="">Seleziona ruolo</option>
            <option value="Connector">Connector</option>
            <option value="Professionista">Professionista</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Categoria</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Descrizione</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
            rows="3"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="notify_on_message"
            checked={form.notify_on_message}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Ricevi notifiche email quando ricevi un messaggio</label>
        </div>

        <button
          type="submit"
          className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300 transition"
        >
          Salva Modifiche
        </button>
      </form>
    </div>
  );
}
