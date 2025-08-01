import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Footer from '../components/Footer';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!password || !confirmPassword) {
      setMessage('Compila entrambi i campi.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Le password non coincidono.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage('Errore: ' + error.message);
    } else {
      setMessage('Password aggiornata con successo! Ora puoi accedere.');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <form onSubmit={handleReset} className="bg-gray-100 dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reimposta password</h2>
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          type="password"
          placeholder="Conferma nuova password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded border dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          disabled={loading}
        >
          {loading ? 'Aggiornamento...' : 'Aggiorna password'}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
      </div>
      <Footer />
    </>
  );
} 