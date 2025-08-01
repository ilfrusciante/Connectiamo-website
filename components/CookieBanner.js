import { useCookieConsent } from '../hooks/useCookieConsent';

export default function CookieBanner() {
  const { needsConsent, acceptCookies, rejectCookies } = useCookieConsent();

  if (!needsConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Gestione Cookie</h3>
          <p className="text-sm text-gray-300">
            Utilizziamo i cookie per migliorare la tua esperienza su Connectiamo. 
            I cookie ci aiutano a fornire funzionalità essenziali e a personalizzare il contenuto. 
            Puoi accettare tutti i cookie o rifiutarli. 
            <a href="/privacy" className="text-yellow-400 hover:underline ml-1">
              Leggi la nostra Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
          >
            Rifiuta
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition"
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
} 