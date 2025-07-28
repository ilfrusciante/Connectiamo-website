import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    nickname: '',
    city: '',
    zip: '',
    role: '',
    category: '',
    description: '',
    notify_on_message: false,
  });

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Errore caricamento profilo:', error.message);
      } else {
        setFormData({
          name: data.name || '',
          surname: data.surname || '',
          nickname: data.nickname || '',
          city: data.city || '',
          zip: data.zip || '',
          role: data.role || '',
          category: data.category || '',
          description: data.description || '',
          notify_on_message: data.notify_on_message || false,
        });

        // Redirect per Admin
        if (data.role === 'Admin') {
          router.push('/admin-dashboard');
        }
      }
    };

    fetchProfile();
  }, [user]);

  const validateCityZip = async (city, zip) => {
    try {
      const res = await fetch(`https://api.zippopotam.us/it/${zip}`);
      if (!res.ok) return false;

      const data = await res.json();
      const normalizedCity = city.trim().toLowerCase();

      return data.places.some(
        (place) =>
          place['place name'].toLowerCase().includes(normalizedCity) ||
          place['state'].toLowerCase().includes(normalizedCity)
      );
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateCityZip(formData.city, formData.zip);
    if (!isValid) {
      alert('Città e CAP non corrispondono');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id);

    if (error) {
      alert('Errore nel salvataggio');
    } else {
      setSuccessMessage('Modifiche salvate con successo!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (!user) return <p>Caricamento...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Area Personale</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <input
          type="text"
          name="surname"
          placeholder="Cognome"
          value={formData.surname}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <input
          type="text"
          name="nickname"
          placeholder="Nickname"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="city"
            placeholder="Città"
            value={formData.city}
            onChange={handleChange}
            className="w-1/2 p-2 rounded text-black"
          />
          <input
            type="text"
            name="zip"
            placeholder="CAP"
            value={formData.zip}
            onChange={handleChange}
            className="w-1/2 p-2 rounded text-black"
          />
        </div>
        <input
          type="text"
          name="role"
          placeholder="Ruolo"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="notify_on_message"
            checked={formData.notify_on_message}
            onChange={handleChange}
          />
          <span>Ricevi notifiche email quando ricevi un messaggio</span>
        </label>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Salva Modifiche
        </button>
        {successMessage && (
          <p className="text-green-400 font-semibold mt-2">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
