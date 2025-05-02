import { useState } from 'react'; import { supabase } from '../utils/supabaseClient'; import { useRouter } from 'next/router'; import Image from 'next/image';

export default function Signup() { const router = useRouter(); const [nome, setNome] = useState(''); const [cognome, setCognome] = useState(''); const [nickname, setNickname] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [role, setRole] = useState(''); const [city, setCity] = useState(''); const [cap, setCap] = useState(''); const [category, setCategory] = useState(''); const [description, setDescription] = useState(''); const [error, setError] = useState('');

const handleSignup = async (e) => { e.preventDefault(); setError('');

// Normalizza la città (prima maiuscola, resto minuscolo)
const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

// Controllo con API Zippopotam.us
try {
  const res = await fetch(`https://api.zippopotam.us/it/${cap}`);
  if (!res.ok) throw new Error('CAP non valido o non trovato');

  const data = await res.json();
  const apiCity = data.places?.[0]['place name'];

  if (!apiCity || apiCity.toLowerCase() !== normalizedCity.toLowerCase()) {
    setError(`Il CAP non corrisponde alla città inserita (${normalizedCity}).`);
    return;
  }
} catch (err) {
  setError('Errore nella verifica del CAP: ' + err.message);
  return;
}

const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
});

if (signUpError) {
  setError(signUpError.message);
  return;
}

const userId = signUpData.user?.id;

if (userId) {
  const { error: profileError } = await supabase.from('profiles').insert([{
    id: userId,
    nome,
    cognome,
    nickname,
    role,
    city: normalizedCity,
    cap,
    category,
    description,
    email,
    created_at: new Date().toISOString(),
  }]);

  if (profileError) {
    setError('Errore durante la creazione del profilo: ' + profileError.message);
    return;
  }

  router.push('/');
}

};

return ( <div className="min-h-screen bg-[#0f1e3c] text-white flex items-center justify-center px-4"> <div className="max-w-lg w-full p-6"> <div className="w-full flex justify-center mb-6"> <Image src="/images/illustration-signup.png" alt="Registrazione" width={0} height={0} sizes="100vw" style={{ width: '100%', maxWidth: '360px', height: 'auto' }} className="rounded-md" /> </div>

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
      <div>
        <label className="block text-sm mb-1">Nome</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm mb-1">Cognome</label>
        <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm mb-1">Nickname</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm mb-1">Ruolo</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Seleziona...</option>
          <option value="Professionista">Professionista</option>
          <option value="Connector">Connector</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <div className="w-2/3">
          <label className="block text-sm mb-1">Città</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="w-1/3">
          <label className="block text-sm mb-1">CAP</label>
          <input type="text" value={cap} onChange={(e) => setCap(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Seleziona...</option>
          <option value="Edilizia">Edilizia</option>
          <option value="Benessere">Benessere</option>
          <option value="Servizi personali">Servizi personali</option>
          <option value="Servizi aziendali">Servizi aziendali</option>
          <option value="Ristorazione">Ristorazione</option>
          <option value="Turismo">Turismo</option>
          <option value="Altro">Altro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Descrizione (facoltativa)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Scrivi una breve descrizione del tuo profilo o dei tuoi contatti..." className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
      </div>

      <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded transition duration-200">
        Registrati
      </button>
    </form>
  </div>
</div>

); }

