import Footer from '../components/Footer';

export default function TerminiECondizioni() {
  return (
    <>
      <div className="min-h-screen bg-[#0f1e3c] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Termini e Condizioni</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg space-y-6 text-sm leading-relaxed">
            <div className="text-center text-gray-400 mb-8">
              <p>Ultimo aggiornamento: 20 agosto 2025</p>
              <div className="border-t border-gray-600 my-4"></div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">1. Accettazione delle Condizioni Generali</h2>
              <p className="mb-3">
                L'accesso, la registrazione, la navigazione e l'utilizzo del presente sito web, comprensivo di ogni sua articolazione tecnica, dominio di secondo livello, applicazione mobile o altra piattaforma digitale riconducibile ai medesimi gestori (di seguito, il "Sito"), sono subordinati all'accettazione preventiva, espressa e integrale delle presenti Condizioni Generali di Utilizzo (di seguito, "Condizioni") e della correlata Informativa sul Trattamento dei Dati Personali.
              </p>
              <p className="mb-3">
                L'utente è tenuto a prendere visione, comprendere e accettare senza riserva alcuna le presenti Condizioni e la relativa Informativa Privacy prima di procedere alla registrazione o all'utilizzo del Sito. L'accettazione avviene mediante selezione dell'apposita opzione ("flag") o altra procedura equivalente prevista in fase di iscrizione o di primo accesso.
              </p>
              <p>
                In assenza di tale accettazione, è fatto divieto assoluto di accedere, navigare, registrarsi o utilizzare in alcun modo il Sito e i servizi da esso erogati.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">2. Titolari e Gestione del Sito</h2>
              <p className="mb-3">
                Il Sito è amministrato e gestito da R.G. e U.G. (congiuntamente, i "Gestori"), i cui estremi identificativi completi potranno essere forniti, per ragioni di tutela della riservatezza, esclusivamente a seguito di richiesta legittima e motivata da parte dell'interessato o di autorità competente.
              </p>
              <p>
                Ogni comunicazione ai Gestori potrà essere indirizzata a: <span className="text-yellow-400">info@connectiamo.com</span>.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">3. Oggetto e Natura del Servizio</h2>
              <p className="mb-3">
                Il Sito si configura quale piattaforma telematica gratuita, finalizzata a favorire l'instaurazione di contatti tra professionisti e altre figure operanti in ambito lavorativo, consentendo lo scambio diretto di comunicazioni tramite sistema di messaggistica interna, al precipuo scopo di individuare opportunità di collaborazione e ampliare la rete di contatti d'affari.
              </p>
              <p>
                Il Sito non commercializza beni o servizi propri, né percepisce corrispettivi, commissioni o compensi per le interazioni poste in essere tra gli utenti.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">4. Limitazioni di Responsabilità ed Esclusione di Garanzie</h2>
              <p className="mb-3">I Gestori:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>non esercitano attività di monitoraggio preventivo o moderazione dei contenuti scambiati tra utenti;</li>
                <li>non rispondono in alcun modo della veridicità, liceità, completezza o correttezza delle comunicazioni intercorse tra gli stessi;</li>
                <li>non assumono responsabilità per accordi, intese, relazioni contrattuali o di altra natura instaurate autonomamente dagli utenti al di fuori del Sito;</li>
                <li>non rispondono di eventuali danni, diretti o indiretti, patrimoniali o non patrimoniali, che possano derivare dall'uso della piattaforma o dai rapporti instaurati per suo tramite;</li>
                <li>non garantiscono la costante disponibilità, continuità o assenza di interruzioni, malfunzionamenti o errori del Sito, che viene fornito "nello stato in cui si trova" (as is).</li>
              </ul>
              <p className="mt-3">
                Eventuali sospensioni, interruzioni o limitazioni dell'accesso al Sito potranno verificarsi per esigenze tecniche, manutentive, aggiornamenti di sistema, eventi di forza maggiore o altre cause non imputabili ai Gestori.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">5. Regole di Condotta e Obblighi dell'Utente</h2>
              <p className="mb-3">
                L'utente si impegna a utilizzare il Sito in modo conforme alla legge, all'ordine pubblico e al buon costume, nonché alle presenti Condizioni. A titolo esemplificativo e non esaustivo, è fatto divieto di:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>pubblicare, trasmettere o diffondere contenuti illeciti, lesivi dell'onore o della reputazione altrui, discriminatori, osceni o contrari a norme imperative;</li>
                <li>utilizzare la piattaforma per finalità estranee alla pubblicazione di offerte di lavoro o proposte di collaborazione professionale;</li>
                <li>divulgare materiale protetto da diritti di proprietà intellettuale senza preventiva autorizzazione del titolare;</li>
                <li>inviare comunicazioni commerciali non sollecitate, spam o messaggi di natura promozionale estranei all'oggetto della piattaforma;</li>
                <li>porre in essere condotte idonee a compromettere la sicurezza, l'integrità o il corretto funzionamento del Sito;</li>
                <li>raccogliere, memorizzare o trattare dati personali di altri utenti senza il loro espresso consenso;</li>
                <li>utilizzare il Sito quale strumento per il compimento o l'agevolazione di attività illecite.</li>
              </ul>
              <p className="mt-3">
                In presenza di violazioni gravi o reiterate, i Gestori potranno disporre la sospensione o la cancellazione immediata dell'account, anche senza preavviso. Eventuali segnalazioni di comportamenti abusivi o contrari alle presenti Condizioni potranno essere inoltrate a: <span className="text-yellow-400">info@connectiamo.com</span>.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">6. Trattamento dei Dati Personali</h2>
              <p>
                Il trattamento dei dati personali avviene secondo quanto disciplinato dalla Informativa sul Trattamento dei Dati Personali, parte integrante delle presenti Condizioni, e nel rispetto del Regolamento (UE) 2016/679 e della normativa italiana vigente.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">7. Modifiche alle Condizioni Generali</h2>
              <p className="mb-3">
                I Gestori si riservano la facoltà di apportare, in qualsiasi momento, modifiche alle presenti Condizioni. Le variazioni saranno comunicate agli utenti registrati a mezzo posta elettronica; in caso di modifiche sostanziali potrà essere richiesta l'accettazione espressa.
              </p>
              <p>
                La prosecuzione nell'uso del Sito dopo la comunicazione delle modifiche costituirà accettazione tacita delle stesse.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">8. Cessazione del Rapporto e Inattività dell'Account</h2>
              <p className="mb-3">
                L'utente può richiedere, in qualunque momento, la cancellazione del proprio account inviando comunicazione a <span className="text-yellow-400">info@connectiamo.com</span>.
              </p>
              <p className="mb-3">
                I Gestori potranno procedere alla cancellazione o sospensione degli account che risultino inattivi per un periodo continuativo di dodici (12) mesi, previa comunicazione con preavviso non inferiore a quindici (15) giorni.
              </p>
              <p>
                La cancellazione comporterà la disattivazione definitiva delle credenziali e la rimozione o anonimizzazione dei contenuti associati, fatte salve eventuali esigenze di legge e la persistenza di copie di backup tecnico.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">9. Legge Applicabile e Foro Competente</h2>
              <p>
                Le presenti Condizioni sono disciplinate dalla legge italiana. Per qualsiasi controversia sarà competente, in via esclusiva, il Foro di Roma, salvo il foro inderogabile del consumatore, ove applicabile.
              </p>
            </div>

            <div className="border-t border-gray-600 pt-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">Informativa sul Trattamento dei Dati Personali (Privacy)</h2>
              <p className="text-center text-gray-400 mb-6">Ultimo aggiornamento: 20 agosto 2025</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">1. Premessa e Accettazione</h3>
                  <p className="mb-3">
                    Il conferimento dei dati personali e l'utilizzo del Sito sono subordinati all'accettazione preventiva, espressa e integrale della presente Informativa, parte integrante dei Termini e Condizioni.
                  </p>
                  <p>
                    L'utente che non intenda fornire i dati richiesti o non accetti le presenti disposizioni non è autorizzato ad utilizzare i servizi.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">2. Titolari del Trattamento</h3>
                  <p className="mb-3">
                    I Titolari del trattamento sono R.G. e U.G., i cui estremi identificativi completi sono disponibili su richiesta legittima e motivata.
                  </p>
                  <p>
                    Email di contatto: <span className="text-yellow-400">info@connectiamo.com</span>
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">3. Categorie di Dati Raccolti</h3>
                  <p className="mb-3">Il Sito raccoglie e tratta le seguenti tipologie di dati personali:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Nome e Cognome</li>
                    <li>Nickname (eventuale)</li>
                    <li>Indirizzo di posta elettronica</li>
                    <li>Eventuali dati inseriti volontariamente dall'utente nelle conversazioni in chat</li>
                    <li>Dati tecnici di navigazione (quali indirizzo IP, log di accesso) raccolti automaticamente per finalità di sicurezza e manutenzione</li>
                    <li>Cookie tecnici strettamente necessari al funzionamento della piattaforma (nessun utilizzo di cookie di profilazione)</li>
                  </ul>
                  <p className="mt-3">
                    L'utente è invitato a non inserire nella chat dati appartenenti a categorie particolari ai sensi dell'art. 9 GDPR, o altre informazioni eccedenti le finalità del servizio.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">4. Finalità e Basi Giuridiche del Trattamento</h3>
                  <p className="mb-3">I dati personali sono trattati per le seguenti finalità:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>erogazione del servizio di messa in contatto e chat tra utenti (art. 6.1.b GDPR);</li>
                    <li>gestione dell'account e fornitura di assistenza tecnica (art. 6.1.b GDPR);</li>
                    <li>prevenzione di abusi, frodi o utilizzi illeciti (art. 6.1.f GDPR);</li>
                    <li>comunicazione di modifiche contrattuali o informazioni rilevanti (art. 6.1.c e 6.1.f GDPR);</li>
                    <li>gestione di segnalazioni relative a comportamenti scorretti (art. 6.1.f GDPR).</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">5. Modalità di Trattamento e Sicurezza</h3>
                  <p>
                    Il trattamento avviene mediante strumenti elettronici, nel rispetto dei principi di correttezza, liceità, trasparenza e minimizzazione dei dati, adottando misure tecniche e organizzative idonee a prevenire accessi non autorizzati, perdita, distruzione o divulgazione non autorizzata.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">6. Conservazione dei Dati</h3>
                  <p className="mb-3">
                    I dati dell'account sono conservati per tutta la durata del rapporto contrattuale e per il tempo strettamente necessario all'adempimento di obblighi di legge. Gli account inattivi per dodici (12) mesi consecutivi potranno essere cancellati con preavviso di quindici (15) giorni.
                  </p>
                  <p>
                    A seguito della cancellazione, i dati saranno eliminati o anonimizzati; eventuali copie nei backup verranno sovrascritte secondo i cicli tecnici ordinari.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">7. Comunicazione e Diffusione</h3>
                  <p className="mb-3">I dati non saranno diffusi. Potranno essere comunicati a:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>fornitori di servizi informatici o di hosting, debitamente nominati responsabili del trattamento ai sensi dell'art. 28 GDPR;</li>
                    <li>autorità competenti, nei limiti e per le finalità previste dalla legge.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">8. Trasferimento all'Estero</h3>
                  <p>
                    Non è previsto il trasferimento di dati personali al di fuori dello Spazio Economico Europeo, salvo il ricorso a fornitori che garantiscano il rispetto del GDPR mediante idonei strumenti giuridici (decisioni di adeguatezza, clausole contrattuali standard o altre garanzie equivalenti).
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">9. Diritti dell'Interessato</h3>
                  <p>
                    L'utente può esercitare in qualsiasi momento i diritti di cui agli artt. 15-22 GDPR, tra cui il diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati, mediante comunicazione scritta all'indirizzo <span className="text-yellow-400">info@connectiamo.com</span>.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">10. Aggiornamenti della Presente Informativa</h3>
                  <p>
                    La presente Informativa potrà essere aggiornata in qualsiasi momento; in caso di modifiche sostanziali, gli utenti registrati saranno informati via email e, ove necessario, potrà essere richiesta una nuova manifestazione di consenso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 