import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = '';
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Credenziali email o password non valide.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email non confermata. Controlla la tua casella email.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Troppi tentativi. Riprova più tardi.';
        } else {
          errorMessage = 'Errore durante il login: ' + error.message;
        }
        setError(errorMessage);
      } else {
        setSuccessMessage('Login effettuato con successo!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      setError('Errore di connessione. Riprova più tardi.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setIsResetLoading(true);

    try {
      // Prima verifica se l'email esiste nel database
      console.log('Verificando email nel database:', resetEmail);
      
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, nickname')
        .eq('email', resetEmail)
        .single();

      if (profileError || !userProfile) {
        console.log('Email non trovata nel database:', resetEmail);
        setResetMessage('Email non trovata nel nostro database. Verifica di aver inserito l\'email corretta.');
        return;
      }

      console.log('Email trovata nel database:', userProfile);

      // Genera un token temporaneo per il reset
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Invia email personalizzata tramite il nostro SMTP
      const emailContent = {
        to: resetEmail,
        subject: 'Recupero Password - Connectiamo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #0f1e3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Connectiamo</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0f1e3c; margin-bottom: 20px;">Recupero Password</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Ciao <strong>${userProfile.nickname || 'utente'}</strong>,
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Hai richiesto il recupero della password per il tuo account Connectiamo.
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">
                Clicca sul pulsante qui sotto per reimpostare la tua password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}" 
                   style="background-color: #0f1e3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reimposta Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Se non hai richiesto tu questo recupero password, ignora questa email.
              </p>
              <p style="color: #666; font-size: 14px;">
                Il link scadrà automaticamente per motivi di sicurezza.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                Questa email è stata inviata da Connectiamo - La piattaforma per connettere professionisti<br>
                <strong>info@connectiamo.com</strong>
              </p>
            </div>
          </div>
        `,
        text: `Recupero Password - Connectiamo

Ciao ${userProfile.nickname || 'utente'},

Hai richiesto il recupero della password per il tuo account Connectiamo.

Clicca su questo link per reimpostare la tua password:
${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}

Se non hai richiesto tu questo recupero password, ignora questa email.

Connectiamo - La piattaforma per connettere professionisti
info@connectiamo.com`
      };
      
      // Importa sendEmail dinamicamente
      const { sendEmail } = await import('../utils/emailService');
      await sendEmail(emailContent);
      
      console.log('Email di recupero password inviata da info@connectiamo.com');
      setShowSuccessModal(true);
      setResetEmail('');
      setShowReset(false);
      
    } catch (error) {
      console.error('Errore nell\'invio email di recupero password:', error);
      
      // Traduci gli errori comuni in italiano
      let errorMessage = 'Errore durante il recupero password: ';
      
      if (error.message.includes('Invalid login')) {
        errorMessage += 'Credenziali email non valide. Contatta il supporto.';
      } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
        errorMessage += 'Errore di connessione al server email. Riprova più tardi.';
      } else if (error.message.includes('EAUTH')) {
        errorMessage += 'Autenticazione email fallita. Verifica le credenziali.';
      } else if (error.message.includes('ECONNECTION')) {
        errorMessage += 'Impossibile connettersi al server email. Riprova più tardi.';
      } else if (error.message.includes('ETIMEDOUT')) {
        errorMessage += 'Timeout della connessione email. Riprova più tardi.';
      } else {
        errorMessage += error.message;
      }
      
      setResetMessage(errorMessage);
    } finally {
      setIsResetLoading(false);
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
        <p className="mt-2 text-center text-sm">
          <button type="button" className="text-blue-500 underline" onClick={() => setShowReset(!showReset)}>
            Recupera password
          </button>
        </p>
        {showReset && (
          <div className="mt-4">
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <button 
              type="button" 
              onClick={handleResetPassword}
              disabled={isResetLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black py-2 px-4 rounded mb-2 transition flex items-center justify-center"
            >
              {isResetLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Invio in corso...
                </>
              ) : (
                'Invia email di recupero'
              )}
            </button>
            {resetMessage && <p className="text-center text-sm mt-2">{resetMessage}</p>}
          </div>
        )}
      </form>

      {/* Modale di successo */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Email inviata con successo!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Abbiamo inviato le istruzioni per il recupero password alla tua email. 
                Controlla anche la cartella spam se non trovi l'email.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
