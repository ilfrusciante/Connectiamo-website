import Footer from '../components/Footer';

export default function ComeFunziona() {
  return (
    <>
      <div className="min-h-screen bg-[#0f1e3c] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Come funziona</h1>
          
          <div className="space-y-8 text-sm leading-relaxed">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">1. Due figure, un'unica piattaforma</h2>
              <p className="mb-3">
                Su Connectiamo interagiscono due figure:
              </p>
              <p className="mb-3">
                <strong>Il Professionista:</strong> chi offre un servizio o un'attività (artigiani, guide turistiche, ristoratori, personal trainer, consulenti, ecc.).
              </p>
              <p className="mb-3">
                <strong>Il Connector:</strong> chi ha una rete di conoscenze e può segnalare o mettere in contatto i professionisti con nuovi potenziali clienti o partner.
              </p>
              <p className="text-gray-300 italic">
                Spesso le due figure coincidono: un professionista può fare anche da connector, e viceversa.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">2. Come funziona il sito</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ti registri come Professionista o come Connector (o entrambi).</li>
                <li>Puoi cercare e farti trovare in base a ruolo, città, CAP e categoria.</li>
                <li>La comunicazione avviene in chat privata e sotto nickname, garantendo riservatezza.</li>
                <li>Non c'è scambio di denaro su Connectiamo: le parti decidono in autonomia la natura della loro collaborazione (referal reciproco, vantaggi economici o altre forme di accordo privato).</li>
                <li>Una volta avviato il contatto, professionisti e connector sono liberi di proseguire comunicazione e accordi su qualsiasi canale: Connectiamo è solo strumento di ricerca e punto di incontro per sviluppare network.</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">3. Esempi pratici di connessioni</h2>
              <div className="space-y-3">
                <p><strong>Portieri di condominio</strong> → possono segnalare a condomini idraulici, pittori, muratori, elettricisti, ditte di pulizie.</p>
                <p><strong>Guide turistiche</strong> → possono proporre ai loro gruppi ristoranti tipici, negozi di souvenir o artigiani locali.</p>
                <p><strong>Accompagnatori turistici</strong> → possono collaborare con piccole aziende agricole o produttori di specialità enogastronomiche.</p>
                <p><strong>Personal trainer ↔️ Nutrizionisti / fisioterapisti</strong> → si segnalano clienti a vicenda, creando pacchetti integrati benessere.</p>
                <p><strong>Fotografi ↔️ Parrucchieri / Wedding planner</strong> → collaborano per matrimoni o eventi, scambiandosi contatti.</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">4. Altri esempi possibili</h2>
              <div className="space-y-3">
                <p><strong>Parrucchieri / estetisti ↔️ NCC e portieri d'albergo</strong> → servizi personalizzati per ospiti di hotel.</p>
                <p><strong>Avvocati / commercialisti ↔️ Consulenti aziendali</strong> → scambio clienti e sinergie professionali.</p>
                <p><strong>Centri sportivi ↔️ Negozi di articoli sportivi</strong> → convenzioni e promozioni reciproche.</p>
                <p><strong>Artigiani locali ↔️ Bed & Breakfast</strong> → promozione di prodotti tipici ai turisti.</p>
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