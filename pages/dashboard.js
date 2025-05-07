import { useEffect, useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../utils/supabaseClient';

export default function Dashboard() { const router = useRouter(); const [user, setUser] = useState(null); const [profile, setProfile] = useState({ nickname: '', description: '', city: '', cap: '' }); const [saving, setSaving] = useState(false);

useEffect(() => { const fetchProfile = async () => { const { data: { session }, } = await supabase.auth.getSession();

if (!session) {
    router.push('/login');
    return;
  }

  setUser(session.user);

  const { data, error } = await supabase
    .from('profiles')
    .select('nickname, description, city, cap')
    .eq('id', session.user.id)
    .single();

  if (data) setProfile(data);
};

fetchProfile();

}, []);

const handleChange = (e) => { setProfile({ ...profile, [e.target.name]: e.target.value }); };

const handleSave = async () => { setSaving(true); const { error } = await supabase.from('profiles').update(profile).eq('id', user.id); if (!error) alert('Profilo aggiornato con successo.'); setSaving(false); };

return ( <div className="max-w-4xl mx-auto py-10 px-6 text-white"> <h2 className="text-3xl font-bold mb-8">Area personale</h2>

{/* Modifica profilo */}
  <div className="bg-gray-800 p-6 rounded-xl mb-10">
    <h3 className="text-xl font-semibold mb-4">Modifica Profilo</h3>
    <div className="space-y-4">
      <input
        type="text"
        name="nickname"
        placeholder="Nickname"
        value={profile.nickname}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
      />
      <input
        type="text"
        name="city"
        placeholder="Città"
        value={profile.city}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
      />
      <input
        type="text"
        name="cap"
        placeholder="CAP"
        value={profile.cap}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="Descrizione"
        value={profile.description}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none h-32"
      ></textarea>
      <button
        onClick={handleSave}
        className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded font-semibold"
        disabled={saving}
      >
        {saving ? 'Salvataggio in corso...' : 'Salva modifiche'}
      </button>
    </div>
  </div>

  {/* Abbonamento */}
  <div className="bg-gray-800 p-6 rounded-xl">
    <h3 className="text-xl font-semibold mb-4">Abbonamento</h3>
    <p className="mb-4 text-gray-300">
      Al momento il tuo account è attivo. In futuro, ai professionisti verrà richiesto un abbonamento dopo un periodo di prova.
    </p>
    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold">
      Scopri di più
    </button>
  </div>
</div>

); }

