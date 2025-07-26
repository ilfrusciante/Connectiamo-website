import { useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../utils/supabaseClient'; import Image from 'next/image';

export default function Signup() { const router = useRouter(); const [formData, setFormData] = useState({ nome: '', cognome: '', nickname: '', email: '', password: '', role: '', city: '', cap: '', category: '', description: '', }); const [error, setError] = useState(''); const [avatarUrl, setAvatarUrl] = useState('');

const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };

const validateCityCap = async () => { const { city, cap } = formData; const response = await fetch(https://api.zippopotam.us/it/${cap}); if (!response.ok) return false;

const data = await response.json();
const matchingPlace = data.places.find((place) => {
  const normalizedPlace = place['place name'].toLowerCase().replace(/\s+/g, '');
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '');
  return normalizedPlace.includes(normalizedCity) || normalizedCity.includes(normalizedPlace);
});
return !!matchingPlace;

};

const handleSubmit = async (e) => { e.preventDefault(); setError('');

const isValidLocation = await validateCityCap();
if (!isValidLocation) {
  setError(`⚠️ Il CAP ${formData.cap} non corrisponde alla città inserita: "${formData.city}".`);
  return;
}

const { email, password, ...profileData } = formData;
const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
});

if (signUpError) {
  setError(signUpError.message);
  return;
}

const userId = data.user?.id;
if (userId) {
  await supabase.from('profiles').insert({ id: userId, ...profileData, avatar_url: avatarUrl });
  router.push('/dashboard');
}

};

return ( <div className="min-h-screen bg-[#0b1d36] flex flex-col items-center justify-center text-white"> <div className="text-center mb-6"> <Image src="/connectiamo_register.png" width={200} height={200} alt="Registrati" /> <h2 className="text-2xl font-bold mt-4">Registrati</h2> <p className="text-sm mt-2 text-gray-300"> Crea un nuovo account per connetterti con altri professionisti.<br /> <span className="text-yellow-400 font-semibold">Il tuo nome e cognome resteranno privati</span> e non verranno mostrati ad altri utenti.<br /> Solo il <span className="text-yellow-400 font-semibold">nickname</span> sarà visibile pubblicamente. </p> </div> {error && <p className="text-red-500 text-center mb-2">{error}</p>} <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3"> <input name="nome" onChange={handleChange} value={formData.nome} placeholder="Nome" className="input" required /> <input name="cognome" onChange={handleChange} value={formData.cognome} placeholder="Cognome" className="input" required /> <input name="nickname" onChange={handleChange} value={formData.nickname} placeholder="Nickname" className="input" required /> <input type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="input" required /> <input type="password" name="password" onChange={handleChange} value={formData.password} placeholder="Password" className="input" required /> <select name="role" onChange={handleChange} value={formData.role} className="input" required> <option value="">Ruolo</option> <option value="Connector">Connector</option> <option value="Professionista">Professionista</option> </select> <div className="flex space-x-2"> <input name="city" onChange={handleChange} value={formData.city} placeholder="Città" className="input flex-1" required /> <input name="cap" onChange={handleChange} value={formData.cap} placeholder="CAP" className="input w-24" required /> </div> {formData.role === 'Professionista' && ( <select name="category" onChange={handleChange} value={formData.category} className="input" required> <option value="">Categoria</option> <option value="Turismo">Turismo</option> <option value="Ristorazione">Ristorazione</option> <option value="Benessere">Benessere</option> <option value="Servizi">Servizi</option> </select> )} <textarea name="description" onChange={handleChange} value={formData.description} placeholder="Descrizione (facoltativa)" className="input" /> <button type="submit" className="w-full py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400">Registrati</button> </form> </div> ); }

