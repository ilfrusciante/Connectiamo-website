import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Head from 'next/head';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Compila tutti i campi.');
      return;
    }

    // 1. Controlla se username esiste già
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles') // <-- Assumiamo che i profili siano nella tabella "profiles"
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      setError('Questo username è già stato scelto, scegline un altro.');
      return;
    }

    if (checkError && checkError.code !== 'PGRST116') {
      setError('Errore nel controllo username.');
      return;
    }

    // 2. Se username libero, procedi con signup
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Salva l'username nei metadati dell'utente
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <Head>
        <title>Registrati - Connectiamo</title>
      </Head>

      <main className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Crea il tuo account</h1>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Scegli un username unico"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-yellow-300 text-gray-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci la tua email"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-yellow-300 text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci una password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-yellow-300 text-gray-800"
              />
            </div>

            {/* Bottone Registrati */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-2 rounded-md transition"
            >
              Registrati
            </button>

            {/* Messaggio di errore */}
            {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
          </form>
        </div>
      </main>
    </>
  );
            }
