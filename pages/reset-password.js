import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Footer from '../components/Footer';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Controlla se ci sono parametri nell'URL
    const { email: urlEmail, token: urlToken } = router.query;
    if (urlEmail && urlToken) {
      setEmail(decodeURIComponent(urlEmail));
      setToken(urlToken);
      validateToken(decodeURIComponent(urlEmail), urlToken);
    } else {
      setMessage('Link di reset password non valido. Richiedi un nuovo link.');
    }
  }, [router.query]);

  const validateToken = async (email, token) => {
    try {
      // Verifica se il token è valido nel database
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('email', email)
        .eq('token', token)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        setMessage('Link di reset password scaduto o non valido. Richiedi un nuovo link.');
        setTokenValid(false);
      } else {
        setMessage('Inserisci la tua nuova password.');
        setTokenValid(true);
      }
    } catch (err) {
      console.error('Errore validazione token:', err);
      setMessage('Errore nella validazione del link. Richiedi un nuovo link.');
      setTokenValid(false);
    }
  };

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
    if (password.length < 6) {
      setMessage('La password deve essere di almeno 6 caratteri.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (!tokenValid) {
        setMessage('Link di reset password non valido. Richiedi un nuovo link.');
        return;
      }

      // Chiama l'API personalizzata per il reset password
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          newPassword: password
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Errore nel reset della password');
      }
      
      // Password aggiornata con successo
      setMessage('Password aggiornata con successo! Ora puoi accedere.');
      
      // Rimuovi il token usato dal database
      await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('email', email)
        .eq('token', token);
      
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Errore durante il reset della password:', error);
      
      // Traduci gli errori comuni in italiano
      let errorMessage = '';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Errore di connessione. Verifica la tua connessione internet.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout della richiesta. Riprova più tardi.';
      } else if (error.message.includes('Token non valido')) {
        errorMessage = 'Link di reset password scaduto o non valido. Richiedi un nuovo link.';
      } else if (error.message.includes('Password troppo corta')) {
        errorMessage = 'La password deve essere di almeno 6 caratteri.';
      } else {
        errorMessage = 'Errore durante il reset della password: ' + error.message;
      }
      
      setMessage(errorMessage);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0f1e3c] text-white flex items-center justify-center p-4">
        <form onSubmit={handleReset} className="bg-gray-100 dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Reimposta password</h2>
          {email && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Email: {email}</p>}
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || !tokenValid}
          >
            {loading ? 'Aggiornamento...' : 'Aggiorna password'}
          </button>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
          
          {!tokenValid && (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Richiedi un nuovo link di reset password
              </button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
} 