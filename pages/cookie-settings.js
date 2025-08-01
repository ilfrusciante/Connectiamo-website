import { useCookieConsent } from '../hooks/useCookieConsent';
import Footer from '../components/Footer';

export default function CookieSettings() {
  const { consent, acceptCookies, rejectCookies, clearConsent } = useCookieConsent();

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Impostazioni Cookie</h1>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Stato attuale</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {consent === 'accepted' && '✅ Hai accettato tutti i cookie'}
              {consent === 'rejected' && '❌ Hai rifiutato i cookie'}
              {consent === null && '❓ Non hai ancora fatto una scelta sui cookie'}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Tipi di cookie utilizzati</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Cookie essenziali</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Necessari per il funzionamento del sito. Includono autenticazione, 
                  preferenze di sessione e sicurezza. Questi cookie non possono essere disabilitati.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Cookie funzionali</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Migliorano l'esperienza utente ricordando le tue preferenze e 
                  personalizzando il contenuto.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Cookie analitici</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Ci aiutano a capire come utilizzi il sito per migliorare i nostri servizi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Modifica le tue preferenze</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Puoi modificare le tue preferenze sui cookie in qualsiasi momento.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={acceptCookies}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition"
              >
                Accetta tutti i cookie
              </button>
              <button
                onClick={rejectCookies}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition"
              >
                Rifiuta tutti i cookie
              </button>
              <button
                onClick={clearConsent}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
              >
                Cancella preferenze
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 