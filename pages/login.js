import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Inserisci email e password.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email o password errati.');
    } else {
      setSuccessMessage('Login riuscito! Reindirizzamento...');
      setTimeout(() => {
        router.push('/'); // Torna alla home dopo login riuscito
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-gray-100 dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>

        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-800 p-2 mb-4 rounded">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 bg-green-100 dark:bg-green-800 p-2 mb-4 rounded">
            {successMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-6 rounded border dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          Accedi
        </button>

        <p className="mt-4 text-center text-sm">
          Non hai un account?{' '}
          <a href="/signup" className="text-blue-500 underline">
            Registrati
          </a>
        </p>
      </form>
    </div>
  );
}
