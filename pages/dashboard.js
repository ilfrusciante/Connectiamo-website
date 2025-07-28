import { useEffect, useState } from 'react'; import { supabase } from '../utils/supabaseClient';

export default function Dashboard() { const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [formData, setFormData] = useState({ name: '', surname: '', nickname: '', city: '', cap: '', role: '', category: '', description: '', notify_on_message: false, });

useEffect(() => { const fetchProfile = async () => { const { data: { user } } = await supabase.auth.getUser(); if (user) { const { data, error } = await supabase .from('profiles') .select('*') .eq('id', user.id) .single();

if (data) {
      setProfile(data);
      setFormData({
        name: data.name || '',
        surname: data.surname || '',
        nickname: data.nickname || '',
        city: data.city || '',
        cap: data.cap || '',
        role: data.role || '',
        category: data.category || '',
        description: data.description || '',
        notify_on_message: data.notify_on_message || false,
      });
    }
  }
  setLoading(false);
};

fetchProfile();

}, []);

const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value, }); };

const handleSubmit = async (e) => { e.preventDefault(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return;

await supabase.from('profiles').update({
  ...formData,
}).eq('id', user.id);
alert('Modifiche salvate con successo');

};

if (loading) return <p className="text-white text-center mt-10">Caricamento...</p>;

return ( <div className="max-w-3xl mx-auto p-4"> <h1 className="text-white text-2xl font-bold mb-6">Area Personale</h1>

<form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-white">Nome</label>
        <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded p-2" />
      </div>
      <div>
        <label className="text-white">Cognome</label>
        <input name="surname" value={formData.surname} onChange={handleChange} className="w-full rounded p-2" />
      </div>
      <div>
        <label className="text-white">Nickname</label>
        <input name="nickname" value={formData.nickname} onChange={handleChange} className="w-full rounded p-2" />
      </div>
      <div>
        <label className="text-white">Città</label>
        <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded p-2" />
      </div>
      <div>
        <label className="text-white">CAP</label>
        <input name="cap" value={formData.cap} onChange={handleChange} className="w-full rounded p-2" />
      </div>
      <div>
        <label className="text-white">Ruolo</label>
        <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded p-2">
          <option value="">-- Seleziona --</option>
          <option value="Connector">Connector</option>
          <option value="Professionista">Professionista</option>
        </select>
      </div>
      <div>
        <label className="text-white">Categoria</label>
        <input name="category" value={formData.category} onChange={handleChange} className="w-full rounded p-2" />
      </div>
    </div>

    <div>
      <label className="text-white">Descrizione</label>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded p-2" rows={3} />
    </div>

    <div className="flex items-center">
      <input type="checkbox" name="notify_on_message" checked={formData.notify_on_message} onChange={handleChange} className="mr-2" />
      <label className="text-white">Ricevi notifiche email quando ricevi un messaggio</label>
    </div>

    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded">
      Salva Modifiche
    </button>
  </form>
</div>

); }

