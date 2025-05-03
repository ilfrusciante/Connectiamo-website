import { useState } from 'react'; import { supabase } from '../utils/supabaseClient'; import { useRouter } from 'next/router'; import Image from 'next/image';

export default function Signup() { const router = useRouter(); const [nome, setNome] = useState(''); const [cognome, setCognome] = useState(''); const [nickname, setNickname] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [role, setRole] = useState(''); const [city, setCity] = useState(''); const [cap, setCap] = useState(''); const [category, setCategory] = useState(''); const [description, setDescription] = useState(''); const [country, setCountry] = useState(''); const [error, setError] = useState('');

const normalize = (str) => str.toLowerCase().trim();

const handleSignup = async (e) => { e.preventDefault(); setError('');

const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

try {
  const res = await fetch(`https://secure.geonames.org/postalCodeSearchJSON?postalcode=${cap}&placename=${normalizedCity}&country=${country}&maxRows=10&username=RobyRob`);
  if (!res.ok) throw new Error('CAP non valido o non trovato');
  const data = await res.json();

  const match = data.postalCodes.find(entry =>
    entry.placeName.toLowerCase().includes(normalize(normalizedCity))
  );

  if (!match) {
    setError(`Il CAP ${cap} non corrisponde alla città inserita (${normalizedCity}).`);
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
    country,
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

      <select value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-700 text-white">
        <option value="">Seleziona paese</option>
        <option value="IT">Italia</option>
        <option value="US">Stati Uniti</option>
        <option value="GB">Regno Unito</option>
        <option value="FR">Francia</option>
        <option value="DE">Germania</option>
        <option value="ES">Spagna</option>
        <option value="CA">Canada</option>
        <option value="AU">Australia</option>
        <option value="BR">Brasile</option>
        <option value="JP">Giappone</option>
        <option value="IN">India</option>
        <option value="CH">Svizzera</option>
        <option value="NL">Paesi Bassi</option>
        <option value="BE">Belgio</option>
        <option value="PT">Portogallo</option>
        <option value="SE">Svezia</option>
        <option value="NO">Norvegia</option>
        <option value="PL">Polonia</option>
        <option value="GR">Grecia</option>
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

      <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded">
        Registrati
      </button>
    </form>
  </div>
</div>

); }

