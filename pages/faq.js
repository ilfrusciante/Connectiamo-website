
import React from "react";
import Footer from '../components/Footer';

export default function FAQ() {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Domande Frequenti</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Come funziona Connectiamo?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Connectiamo è una piattaforma che ti permette di connetterti con altri professionisti. 
                Registrati, crea il tuo profilo e inizia a cercare contatti nella tua zona.
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">È gratuito?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Sì, l'uso base di Connectiamo è completamente gratuito. 
                Puoi registrarti, creare il tuo profilo e connetterti con altri utenti senza costi.
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">I miei dati sono sicuri?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Assolutamente sì. Utilizziamo tecnologie avanzate per proteggere i tuoi dati personali 
                e rispettiamo tutte le normative sulla privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
