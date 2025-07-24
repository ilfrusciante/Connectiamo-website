import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';
import AvatarUpload from '../components/AvatarUpload';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    nickname: '',
    description: '',
    city: '',
    cap: '',
    role: '',
    category: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      const { data } = await supabase
        .from('profiles')
        .select('nickname, description, city, cap, role, category, avatar')
        .eq('id', session.user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (file) => {
    setAvatarFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    let avatarUrl = profile.avatar;
    if (avatarFile && user) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }
    }
    const { error } = await supabase
      .from('profiles')
      .update({ ...profile, avatar: avatarUrl })
      .eq('id', user.id);

    if (!error) {
      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      setAvatarFile(null);
      alert('Profilo aggiornato con successo.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white">
      {/* CONTENUTO */}
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Area personale</h2>

        {/* Modifica profilo */}
        <div className="bg-gray-800 p-6 rounded-xl mb-10">
          <h3 className="text-xl font-semibold mb-4">Modifica Profilo</h3>
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <AvatarUpload onUpload={handleAvatarUpload} />
              {profile.avatar && !avatarFile && (
                <img src={profile.avatar} alt="Avatar attuale" className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400 mt-2" />
              )}
            </div>
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
            <select
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
            >
              <option value="">Ruolo</option>
              <option value="Connector">Connector</option>
              <option value="Professionista">Professionista</option>
            </select>
            <select
              name="category"
              value={profile.category}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
            >
              <option value="">Categoria</option>
              <option value="Edilizia">Edilizia</option>
              <option value="Benessere">Benessere</option>
              <option value="Tecnologie">Tecnologie</option>
              <option value="Servizi personali">Servizi personali</option>
              <option value="Servizi aziendali">Servizi aziendali</option>
              <option value="Altro">Altro</option>
            </select>
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
    </div>
  );
}
