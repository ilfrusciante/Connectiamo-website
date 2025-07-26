import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AvatarUpload from '../components/AvatarUpload';

export default function Signup() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [cap, setCap] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase();

  const handleAvatarUpload = (file) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    const normalizedCity = normalize(city);

    try {
      const res = await fetch(`https://secure.geonames.org/postalCodeLookupJSON?postalcode=${cap}&maxRows=10&username=RobyRob`);
      if (!res.ok) throw new Error('Errore nella richiesta a GeoNames');
      const data = await res.json();
      const places = data.postalcodes || [];

      const match = places.some((place) => {
        const placeName = normalize(place.placeName || '');
        const adminName2 = normalize(place.adminName2 || '');
        return (
          placeName.includes(normalizedCity) ||
          normalizedCity.includes(placeName) ||
          adminName2.includes(normalizedCity) ||
          normalizedCity.includes(adminName2)
        );
      });

      if (!match) {
        setError(`⚠️ Il CAP ${cap} non corrisponde alla città inserita: "${city}".`);
        setUploading(false);
        return;
      }
    } catch (err) {
      setError('Errore nella verifica del CAP: ' + err.message);
      setUploading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setUploading(false);
      return;
    }

    const userId = signUpData.user?.id;
    let avatarUrl = '';

    if (userId && avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
      if (uploadError) {
        setError('Errore durante il caricamento dell\'immagine profilo: ' + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatarUrl = publicUrlData.publicUrl;
    }

    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: userId,
        nome,
        cognome,
        nickname,
        role,
        city: city.trim(),
        cap,
        category,
        description,
        email,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
      }]);

      if (profileError) {
        setError('Errore durante la creazione del profilo: ' + profileError.message);
        setUploading(false);
        return;
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
      setUploading(false);
      return;
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full p-6">
        <div className="w-full flex justify-center mb-6">
          <Image src="/images/illustration-signup.png" alt="Registrazione" width={0} height={0} sizes="100vw" style={{ width: '100%', maxWidth: '360px', height: 'auto' }} className="rounded-md" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">Registrati</h2>
        <p className="text-center text-gray-300 text-sm mb-4">
          Crea un nuovo account per connetterti con altri professionisti.
        </p>
        <p className="text-xs text-yellow-300 text-center mb-6">
          Il tuo <strong>nome e cognome resteranno privati</strong> e non verranno mostrati ad altri utenti. <br />
          Solo il <strong>nickname</strong> sarà visibile pubblicamente.
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <AvatarUpload onUpload={handleAvatarUpload} previewUrl={avatarPreview} />
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required placeholder="Cognome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Nickname" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />

          <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white">
            <option value="">Seleziona ruolo</option>
            <option value="Professionista">Professionista</option>
            <option value="Connector">Connector</option>
          </select>

          <div className="flex space-x-4">
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Città" className="w-2/3 px-3 py-2 rounded bg-gray-700 text-white" />
            <input type="text" value={cap} onChange={(e) => setCap(e.target.value)} required placeholder="CAP" className="w-1/3 px-3 py-2 rounded bg-gray-700 text-white" />
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white">
            <option value="">Seleziona categoria</option>
            <option value="Edilizia">Edilizia</option>
            <option value="Benessere">Benessere</option>
            <option value="Servizi personali">Servizi personali</option>
            <option value="Servizi aziendali">Servizi aziendali</option>
            <option value="Ristorazione">Ristorazione</option>
            <option value="Turismo">Turismo</option>
            <option value="Altro">Altro</option>
          </select>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione (facoltativa)" className="w-full px-3 py-2 rounded bg-gray-700 text-white" rows={3}></textarea>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded" disabled={uploading}>
            {uploading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-xs mx-auto">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Grazie per esserti registrato</h2>
            <p className="text-gray-700 mb-2">Verrai reindirizzato alla home...</p>
          </div>
        </div>
      )}
    </div>
  );
}
