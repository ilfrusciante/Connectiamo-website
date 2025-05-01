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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-2">Registrati</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block mb-1 text-sm">Nome</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Ruolo</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500">
            <option value="">Seleziona...</option>
            <option value="Professionista">Professionista</option>
            <option value="Connector">Connector</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Città</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <div>
          <label className="block mb-1 text-sm">CAP</label>
          <input type="text" value={cap} onChange={(e) => setCap(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Categoria</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500" />
        </div>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200">
          Registrati
        </button>
      </form>
    </div>
  );
}
