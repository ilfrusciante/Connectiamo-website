import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { sendEmail } from '../utils/emailService';
import Footer from '../components/Footer';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    if (!resetEmail) {
      setResetMessage('Inserisci la tua email.');
      return;
    }
    
    try {
      // Genera un token temporaneo per il reset (simulato)
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Invia email di recupero password tramite il nostro servizio SMTP
      const emailContent = {
        to: resetEmail,
        subject: 'Recupero password - Connectiamo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #0f1e3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Connectiamo</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0f1e3c; margin-bottom: 20px;">Recupero Password</h2>
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

Hai richiesto il recupero della password per il tuo account Connectiamo.

Clicca su questo link per reimpostare la tua password:
${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}

Se non hai richiesto tu questo recupero password, ignora questa email.

Connectiamo - La piattaforma per connettere professionisti
info@connectiamo.com`
      };
      
      await sendEmail(emailContent);
      setResetMessage('Se l\'email esiste, riceverai le istruzioni per reimpostare la password.');
      
    } catch (error) {
      console.error('Errore nell\'invio email di recupero password:', error);
      setResetMessage('Errore durante il recupero password: ' + error.message);
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
          <form onSubmit={handleResetPassword} className="mt-4">
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mb-2 transition">
              Invia istruzioni
            </button>
            {resetMessage && <p className="text-center text-sm mt-2">{resetMessage}</p>}
          </form>
        )}
      </form>
    </div>
  );
}
