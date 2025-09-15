import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import AvatarUpload from '../components/AvatarUpload';
import CityAutocomplete from '../components/CityAutocomplete';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    nickname: '',
    city: '',
    cap: '',
    role: '',
    category: '',
    description: '',
    notify_on_message: false
  });
  const [availableCaps, setAvailableCaps] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const categorieDisponibili = [
    'Edilizia',
    'Benessere',
    'Tecnologie',
    'Servizi personali',
    'Servizi aziendali',
    'Ristorazione',
    'Intrattenimento',
    'Altro'
  ];

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
            nome: data.nome || '',
            cognome: data.cognome || '',
            nickname: data.nickname || '',
            city: data.city || '',
            cap: data.cap || '',
            role: data.role || '',
            category: data.category || '',
            description: data.description || '',
            notify_on_message: data.notify_on_message || false
          });
          setAvatarUrl(data.avatar_url || null);
          setAvatarPreview(data.avatar_url || null);
          
          // Carica i CAP per la città esistente
          if (data.city) {
            loadCapsForCity(data.city);
          }
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
    
    // Se cambia la città manualmente, carica i CAP corrispondenti
    if (name === 'city') {
      loadCapsForCity(value);
    }
  };

  const handleCitySelect = (caps) => {
    if (caps && caps.length > 0) {
      setAvailableCaps(caps);
      setForm(prev => ({ ...prev, cap: caps[0] }));
    } else {
      setAvailableCaps([]);
      setForm(prev => ({ ...prev, cap: '' }));
    }
  };

  // Funzione per caricare i CAP per una città esistente
  const loadCapsForCity = async (cityName) => {
    if (!cityName) return;
    
    try {
      let response = await fetch('/comuni.json');
      let data;
      if (!response.ok) {
        response = await fetch('/gi_comuni.json');
        if (!response.ok) return;
      }
      
      data = await response.json();
      const cityData = data.find(comune => 
        comune.nome && comune.nome.trim().toLowerCase() === cityName.trim().toLowerCase()
      );
      
      if (cityData && cityData.cap && Array.isArray(cityData.cap)) {
        const caps = cityData.cap.filter(cap => cap && cap.toString().trim() !== '');
        setAvailableCaps(caps);
        
        // Se il CAP attuale non è nella lista, lo rimuovo
        if (form.cap && !caps.includes(form.cap)) {
          setForm(prev => ({ ...prev, cap: '' }));
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento CAP per città:', error);
    }
  };

  const handleAvatarUpload = (file) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateCityZip = async (city, cap) => {
    try {
      const res = await fetch(`https://api.zippopotam.us/it/${cap}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.places.some((place) => {
        const normalizedCity = city.toLowerCase();
        return (
          place['place name'].toLowerCase().includes(normalizedCity) ||
          place['state'].toLowerCase().includes(normalizedCity)
        );
      });
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const isValid = await validateCityZip(form.city, form.cap);
    if (!isValid) {
      setMessage('⚠️ Il CAP non corrisponde alla città.');
      setSaving(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    let newAvatarUrl = avatarUrl;
    if (avatarFile && user) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
      if (uploadError) {
        setMessage('❌ Errore durante il caricamento dell\'immagine profilo: ' + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      newAvatarUrl = publicUrlData.publicUrl;
      setAvatarUrl(newAvatarUrl);
    }
    const { error } = await supabase
      .from('profiles')
      .update({ ...form, avatar_url: newAvatarUrl })
      .eq('id', user.id);

    if (!error) setMessage('✅ Profilo aggiornato con successo!');
    else setMessage('❌ Errore nell\'aggiornamento del profilo.');
    setSaving(false);
  };

  if (!profile) return <p className="text-white text-center mt-10">Caricamento profilo...</p>;

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Area Personale</h1>
      <div className="flex justify-center mb-6">
        <AvatarUpload onUpload={handleAvatarUpload} previewUrl={avatarPreview} />
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block mb-1 text-sm">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Cognome</label>
          <input
            type="text"
            name="cognome"
            value={form.cognome}
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
            <CityAutocomplete
              value={form.city}
              onChange={(value) => setForm(prev => ({ ...prev, city: value }))}
              onCitySelect={handleCitySelect}
              placeholder="Città"
              className="w-full bg-white text-black rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">CAP</label>
            <select
              name="cap"
              value={form.cap}
              onChange={handleChange}
              className="w-full bg-white text-black rounded px-4 py-2 appearance-none bg-no-repeat bg-right pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundSize: '1.5em 1.5em'
              }}
              disabled={availableCaps.length === 0}
            >
              <option value="">CAP</option>
              {availableCaps.map((capOption, index) => (
                <option key={index} value={capOption}>
                  {capOption}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm">Ruolo</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2 appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Seleziona ruolo</option>
            <option value="Cerco clienti">Cerco clienti</option>
            <option value="Procuro clienti">Procuro clienti</option>
            <option value="Collaborazione">Collaborazione (Cerco/Procuro)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Categoria</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-white text-black rounded px-4 py-2 appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Seleziona categoria</option>
            {categorieDisponibili.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
          disabled={saving}
        >
          {saving ? 'Salvataggio...' : 'Salva Modifiche'}
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </form>
      </div>
      <Footer />
    </>
  );
}
