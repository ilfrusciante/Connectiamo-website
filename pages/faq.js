
import React from "react";

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">Domande frequenti</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Come funziona Connectiamo?</h2>
          <p className="mt-2 text-base">
            Connectiamo ti permette di cercare e contattare persone in base a ruolo, città, zona e categoria.
            Basta creare un profilo e iniziare a interagire.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">È gratuito?</h2>
          <p className="mt-2 text-base">
            Sì, la piattaforma è completamente gratuita. In futuro potrebbero essere disponibili funzionalità premium opzionali.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Come proteggete i miei dati?</h2>
          <p className="mt-2 text-base">
            Utilizziamo Supabase e best practices di sicurezza per proteggere i tuoi dati personali.
            Consulta la sezione Privacy per maggiori dettagli.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Non trovo persone nella mia zona</h2>
          <p className="mt-2 text-base">
            Puoi ampliare la tua ricerca con filtri diversi o invitare nuovi utenti a iscriversi alla piattaforma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
