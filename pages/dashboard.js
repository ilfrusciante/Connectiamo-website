import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Errore nel recupero del profilo:', error);
    } else {
      if (data.role === 'Admin') {
        router.push('/admin-dashboard');
        return;
      }
      setProfile(data);
      setLoading(false);
    }
  };

  const validateCityZip = async (city, zip) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/it/${zip}`);
      const data = await response.json();

      if (!data || !data.places || data.places.length === 0) return false;

      return data.places.some((place) => {
        const placeName = place['place name']?.toLowerCase();
        const adminName2 = place['admin name 2']?.toLowerCase();
        const cityNormalized = city.toLowerCase();

        return placeName.includes(cityNormalized) || adminName2.includes(cityNormalized);
      });
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const valid = await validateCityZip(profile.city, profile.cap);
    if (!valid) {
      setMessage('⚠️ Il CAP non corrisponde alla città.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) {
      console.error(error);
      setMessage('❌ Errore durante il salvataggio');
    } else {
      setMessage('✅ Modifiche salvate con successo!');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading || !profile) return <p>Caricamento in corso...</p>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Area Personale</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl shadow-md">
        <label className="block mb-2">
          Nome
          <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
        </label>
        <label className="block mb-2">
          Cognome
          <input type="text" name="surname" value={profile.surname || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
        </label>
        <label className="block mb-2">
          Nickname
          <input type="text" name="nickname" value={profile.nickname || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
        </label>
        <div className="flex gap-4 mb-2">
          <label className="flex-1">
            Città
            <input type="text" name="city" value={profile.city || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
          </label>
          <label className="w-32">
            CAP
            <input type="text" name="cap" value={profile.cap || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
          </label>
        </div>
        <label className="block mb-2">
          Ruolo
          <input type="text" name="role" value={profile.role || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
        </label>
        <label className="block mb-2">
          Categoria
          <input type="text" name="category" value={profile.category || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" />
        </label>
        <label className="block mb-2">
          Descrizione
          <textarea name="description" value={profile.description || ''} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-white text-black" rows="3" />
        </label>
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            name="notify_on_message"
            checked={profile.notify_on_message || false}
            onChange={handleChange}
            className="mr-2"
          />
          Ricevi notifiche email quando ricevi un messaggio
        </label>
        {message && <div className="mb-4 text-sm">{message}</div>}
        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400">
          Salva Modifiche
        </button>
      </form>
    </div>
  );
}
