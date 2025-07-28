import { useEffect, useState } from 'react'; import { supabase } from '../lib/supabaseClient'; import { useRouter } from 'next/router'; import Navbar from '../components/Navbar';

export default function Dashboard() { const [profile, setProfile] = useState(null); const [formData, setFormData] = useState({}); const [successMsg, setSuccessMsg] = useState(''); const [errorMsg, setErrorMsg] = useState(''); const router = useRouter();

useEffect(() => { const fetchProfile = async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) { router.push('/'); return; }

const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error(error);
  } else {
    if (data.role === 'Admin') {
      router.push('/admin-dashboard');
    } else {
      setProfile(data);
      setFormData(data);
    }
  }
};

fetchProfile();

}, [router]);

const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value, }); };

const normalizeCity = (city) => { return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(); };

const validateCityZip = async (city, zip) => { try { const response = await fetch(https://api.zippopotam.us/it/${zip}); if (!response.ok) return false; const data = await response.json(); return data.places.some((place) => { return ( place["place name"].toLowerCase().includes(city.toLowerCase()) || place["state"]?.toLowerCase().includes(city.toLowerCase()) || place["state abbreviation"]?.toLowerCase().includes(city.toLowerCase()) ); }); } catch (err) { console.error('Errore nella validazione città/CAP:', err); return false; } };

const handleSubmit = async (e) => { e.preventDefault(); setSuccessMsg(''); setErrorMsg('');

const cityOk = await validateCityZip(formData.city, formData.cap);
if (!cityOk) {
  setErrorMsg('Città e CAP non corrispondono.');
  return;
}

const { error } = await supabase
  .from('profiles')
  .update({
    name: formData.name,
    surname: formData.surname,
    nickname: formData.nickname,
    city: normalizeCity(formData.city),
    cap: formData.cap,
    role: formData.role,
    category: formData.category,
    description: formData.description,
    notify_on_message: formData.notify_on_message,
  })
  .eq('id', profile.id);

if (error) {
  setErrorMsg('Errore durante il salvataggio.');
} else {
  setSuccessMsg('Modifiche salvate con successo.');
}

};

return ( <> <Navbar /> <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-xl"> <h2 className="text-2xl font-semibold text-white mb-4">Area Personale</h2> <form onSubmit={handleSubmit} className="space-y-4"> <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Nome" className="w-full p-2 rounded" /> <input name="surname" value={formData.surname || ''} onChange={handleChange} placeholder="Cognome" className="w-full p-2 rounded" /> <input name="nickname" value={formData.nickname || ''} onChange={handleChange} placeholder="Nickname" className="w-full p-2 rounded" /> <div className="flex gap-2"> <input name="city" value={formData.city || ''} onChange={handleChange} placeholder="Città" className="w-2/3 p-2 rounded" /> <input name="cap" value={formData.cap || ''} onChange={handleChange} placeholder="CAP" className="w-1/3 p-2 rounded" /> </div> <input name="role" value={formData.role || ''} onChange={handleChange} placeholder="Ruolo" className="w-full p-2 rounded" /> <input name="category" value={formData.category || ''} onChange={handleChange} placeholder="Categoria" className="w-full p-2 rounded" /> <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Descrizione" className="w-full p-2 rounded" /> <label className="flex items-center text-white"> <input type="checkbox" name="notify_on_message" checked={formData.notify_on_message || false} onChange={handleChange} className="mr-2" /> Ricevi notifiche email quando ricevi un messaggio </label> {successMsg && <p className="text-green-400">{successMsg}</p>} {errorMsg && <p className="text-red-400">{errorMsg}</p>} <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded">Salva Modifiche</button> </form> </div> </> ); }

