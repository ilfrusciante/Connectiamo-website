import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [cap, setCap] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

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
        username,
        role,
        city,
        cap,
        category,
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

  return (
    <form onSubmit={handleSignup} className="p-4 space-y-4 max-w-md mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" placeholder="Nome" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" placeholder="Ruolo" value={role} onChange={(e) => setRole(e.target.value)} required />
      <input type="text" placeholder="Città" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input type="text" placeholder="CAP" value={cap} onChange={(e) => setCap(e.target.value)} required />
      <input type="text" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <button type="submit">Registrati</button>
    </form>
  );
}
