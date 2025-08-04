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
  const router = useRouter();

  useEffect(() => {
    // Controlla se ci sono parametri nell'URL (sistema personalizzato)
    const { email: urlEmail, token: urlToken } = router.query;
    if (urlEmail && urlToken) {
      setEmail(decodeURIComponent(urlEmail));
      setToken(urlToken);
      console.log('Usando sistema personalizzato con token');
    } else {
      // Verifica se l'utente è autenticato (sistema Supabase)
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setMessage('Sessione non valida. Richiedi un nuovo link di reset password.');
        } else {
          console.log('Usando sistema Supabase');
        }
      };
      checkAuth();
    }
  }, [router.query]);

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
      console.log('Aggiornamento password con Supabase');
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Errore aggiornamento password:', error);
        
        // Traduci gli errori comuni in italiano
        let errorMessage = '';
        
        if (error.message.includes('Password should be at least')) {
          errorMessage = 'La password deve essere di almeno 6 caratteri.';
        } else if (error.message.includes('New password should be different from the old password')) {
          errorMessage = 'La nuova password deve essere diversa dalla password attuale.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenziali di accesso non valide.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Utente non trovato.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email non confermata. Verifica la tua email.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Troppe richieste. Riprova più tardi.';
        } else {
          errorMessage = 'Errore: ' + error.message;
        }
        
        setMessage(errorMessage);
      } else {
        setMessage('Password aggiornata con successo! Ora puoi accedere.');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      console.error('Errore durante il reset della password:', error);
      
      // Traduci gli errori di rete in italiano
      let errorMessage = '';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Errore di connessione. Verifica la tua connessione internet.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout della richiesta. Riprova più tardi.';
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