import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.error('Errore nel recupero del profilo:', error);
      } else {
        setProfile(data);
        if (data.ruolo === 'Admin') {
          router.push('/admin-dashboard');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const validateCityZip = async (city, zip) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/it/${zip}`);
      const data = await response.json();
      if (!data.places) return false;
      return data.places.some(
        (place) =>
          city.toLowerCase().includes(place['place name'].toLowerCase()) ||
          city.toLowerCase().includes(place['state'].toLowerCase()) ||
          place['place name'].toLowerCase().includes(city.toLowerCase())
      );
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const cityOk = await validateCityZip(profile.citta, profile.cap);
    if (!cityOk) {
      alert('La città non corrisponde al CAP inserito.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) {
      console.error('Errore durante il salvataggio:', error);
    } else {
      setSuccessMessage('Modifiche salvate con successo!');
    }
  };

  if (loading || !profile) return <p>Caricamento...</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4">
      <div className="max-w-xl mx-auto mt-10 bg-slate-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Area Personale</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nome</label>
            <input
              type="text"
              value={profile.nome || ''}
              onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block mb-1">Cognome</label>
            <input
              type="text"
              value={profile.cognome || ''}
              onChange={(e) => setProfile({ ...profile, cognome: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block mb-1">Nickname</label>
            <input
              type="text"
              value={profile.nickname || ''}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Città</label>
              <input
                type="text"
                value={profile.citta || ''}
                onChange={(e) =>
                  setProfile({ ...profile, citta: e.target.value })
                }
                className="w-full p-2 rounded text-black"
              />
            </div>
            <div className="w-1/3">
              <label className="block mb-1">CAP</label>
              <input
                type="text"
                value={profile.cap || ''}
                onChange={(e) => setProfile({ ...profile, cap: e.target.value })}
                className="w-full p-2 rounded text-black"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Ruolo</label>
            <input
              type="text"
              value={profile.ruolo || ''}
              onChange={(e) => setProfile({ ...profile, ruolo: e.target.value })}
              className="w-full p-2 rounded text-black"
              readOnly
            />
          </div>
          <div>
            <label className="block mb-1">Categoria</label>
            <input
              type="text"
              value={profile.categoria || ''}
              onChange={(e) =>
                setProfile({ ...profile, categoria: e.target.value })
              }
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block mb-1">Descrizione</label>
            <textarea
              value={profile.descrizione || ''}
              onChange={(e) =>
                setProfile({ ...profile, descrizione: e.target.value })
              }
              className="w-full p-2 rounded text-black"
              rows="3"
            ></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.notify_on_message}
              onChange={(e) =>
                setProfile({ ...profile, notify_on_message: e.target.checked })
              }
            />
            <label>Ricevi notifiche email quando ricevi un messaggio</label>
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Salva Modifiche
          </button>
          {successMessage && (
            <p className="text-green-400 mt-2">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
