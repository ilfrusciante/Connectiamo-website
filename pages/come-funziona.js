import Footer from '../components/Footer';

export default function ComeFunziona() {
  return (
    <>
      <div className="min-h-screen bg-[#0f1e3c] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Come funziona</h1>
          
          <div className="space-y-8 text-sm leading-relaxed">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">1. Cosa offre Connectiamo.com</h2>
              <p className="mb-3">
                Connectiamo è la piattaforma gratuita che ti permette di trovare nuove opportunità di lavoro e di collaborazione in modo semplice e veloce.
              </p>
              <p className="mb-3">
                Registrandoti, potrai entrare in contatto con professionisti che cercano clienti o con chi è in grado di procurarteli.
              </p>
              <p className="mb-3">
                La piattaforma è solo il punto di partenza: uno spazio sicuro, riservato e gratuito dove far nascere relazioni di valore, che potrai poi sviluppare liberamente sui canali che preferisci.
              </p>
              <p className="text-gray-300 italic">
                Non vi sono scambi su Connectiamo.com: dopo il contatto le parti decidono in autonomia la natura della loro collaborazione (referal reciproco, vantaggi economici o altre forme di accordo privato).
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">2. Un punto di incontro tra domanda e offerta</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cerco Clienti</strong><br />Sei un professionista che desidera ampliare la propria rete di contatti, sviluppare nuove collaborazioni e accrescere il proprio portafoglio clienti.</li>
                <li><strong>Procuro Clienti</strong><br />Hai la capacità di indirizzare potenziali clienti verso professionisti di fiducia e vuoi valorizzare questa tua competenza.</li>
                <li><strong>Cerco e Procuro Clienti</strong><br />Vuoi far crescere la tua attività ma, allo stesso tempo, creare opportunità per altri: cerchi nuovi clienti per i tuoi servizi e sei in grado di segnalare contatti ad altri professionisti quando le richieste non rientrano nel tuo ambito.</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">3. Esempi pratici di opportunità su Connectiamo.com</h2>
              <div className="space-y-3">
                <p><strong>Portieri di condominio</strong> → diventano il punto di riferimento dei residenti, consigliando professionisti affidabili per ogni esigenza domestica: dall’idraulico al pittore, dall’elettricista alle imprese di pulizie.</p>
                <p><strong>Guide turistiche</strong> → arricchiscono l’esperienza dei loro gruppi suggerendo ristoranti tipici, botteghe artigiane e negozi di souvenir autentici, trasformando una visita in un ricordo indimenticabile.</p>
                <p><strong>Parrucchieri ed estetisti</strong> → possono collaborare con NCC e portieri d’albergo, offrendo pacchetti esclusivi di bellezza e comfort per gli ospiti degli hotel, con un servizio su misura che fa sentire speciali.</p>
                <p><strong>Avvocati e commercialisti</strong> → creano sinergie strategiche con consulenti aziendali, generando scambio di clienti e nuove opportunità di crescita reciproca.</p>
                <p><strong>Centri sportivi</strong> → stringono partnership con negozi di articoli sportivi, offrendo convenzioni vantaggiose e promozioni che fidelizzano i clienti e attraggono nuovi iscritti.</p>
                <p><strong>Artigiani locali</strong> → trovano nei Bed & Breakfast un canale privilegiato per far conoscere i propri prodotti tipici ai turisti, trasformando ogni soggiorno in un’esperienza autentica del territorio.</p>
                <p><strong>Accompagnatori / Operatori turistici</strong> → arricchiscono i loro itinerari collaborando con aziende agricole, strutture ricettive e produttori enogastronomici, offrendo esperienze uniche e complete.</p>
                <p><strong>Personal trainer</strong> → possono proporre programmi integrati di benessere insieme a nutrizionisti e fisioterapisti, creando pacchetti esclusivi che uniscono salute, performance e prevenzione.</p>
                <p><strong>Fotografi</strong> → collaborano con parrucchieri e wedding planner per matrimoni ed eventi, offrendo soluzioni coordinate e uniche, con un passaparola che moltiplica i contatti.</p>
              </div>
            </div>

            <div className="bg-yellow-400 text-black p-6 rounded-lg text-center">
              <p className="text-lg font-semibold">
                👉 Connectiamo nasce come un passaparola evoluto, strutturato e sicuro, dove ogni contatto diventa un'opportunità concreta di crescita.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
