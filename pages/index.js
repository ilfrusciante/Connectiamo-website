import Head from 'next/head'; import Image from 'next/image'; import { useState } from 'react'; import { useRouter } from 'next/router'; import Navbar from '../components/Navbar'; import Footer from '../components/Footer';

export default function Home() { const router = useRouter(); const [role, setRole] = useState(''); const [city, setCity] = useState(''); const [category, setCategory] = useState(''); const [cap, setCap] = useState('');

const handleSearch = () => { if (!role || !city) { alert('Seleziona almeno Ruolo e Città.'); return; } router.push(/search-results?role=${role}&city=${city}&category=${category}&cap=${cap}); };

return ( <> <Head> <title>Connectiamo</title> </Head>

<Navbar />

  <main className="bg-white text-gray-900">
    {/* HERO SECTION */}
    <section className="bg-[#0f1e3c] text-white pt-20 pb-12 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6 z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Connetti <span className="text-yellow-400">segnalatori</span> <br /> e professionisti
          </h1>
          <p className="text-lg text-blue-100">
            Una piattaforma semplice per creare connessioni tra chi ha contatti e chi offre servizi.
          </p>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fade-in">
          <Image
            src="/images/connect-animation.gif" // inserisci qui una vera animazione
            alt="Animazione Connessione"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </section>

    {/* BARRA DI RICERCA */}
    <section className="bg-white py-10 px-6 md:px-20 flex justify-center">
      <div className="w-full max-w-4xl animate-fade-in-delay">
        <div className="bg-yellow-400 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
          >
            <option value="">Ruolo</option>
            <option value="Professionista">Professionista</option>
            <option value="Connector">Connector</option>
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
          >
            <option value="">Città</option>
            <option value="Roma">Roma</option>
            <option value="Milano">Milano</option>
            <option value="Napoli">Napoli</option>
          </select>

          <input
            type="text"
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            placeholder="CAP"
            className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
          >
            <option value="">Categoria</option>
            <option value="Edilizia">Edilizia</option>
            <option value="Ristorazione">Ristorazione</option>
            <option value="Servizi turistici">Servizi turistici</option>
          </select>

          <button
            onClick={handleSearch}
            className={`font-semibold px-5 py-2 rounded-md w-full md:w-auto transition ${
              !role || !city
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Cerca
          </button>
        </div>
      </div>
    </section>

    {/* CHI SIAMO */}
    <section className="py-16 px-6 md:px-20 bg-white animate-fade-in-delay">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Chi siamo</h2>
        <p className="text-gray-800 text-lg">
          <strong>Connectiamo</strong> è una piattaforma nata per facilitare lo scambio di contatti di valore.
          Unisce chi ha relazioni utili con chi offre servizi locali: artigiani, ristoratori, guide turistiche e molti altri.
        </p>
        <p className="text-gray-800 text-lg">
          Tutto avviene con semplicità: nessun pagamento integrato, solo contatti e messaggi. Ogni utente decide come accordarsi.
        </p>
      </div>
    </section>

    {/* COME FUNZIONA */}
    <section className="bg-gray-100 py-16 px-6 md:px-20 animate-fade-in-delay">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: '1 Registrati',
              text: 'Crea il tuo profilo da Connector o Professionista.',
              image: '/images/step1-registrati.png',
            },
            {
              title: '2 Trova contatti',
              text: 'Cerca persone per zona e categoria.',
              image: '/images/step2-trova.png',
            },
            {
              title: '3 Connettiti',
              text: 'Avvia la conversazione con la messaggistica interna.',
              image: '/images/step3-connetti.png',
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow text-center">
              <Image src={step.image} alt={step.title} width={64} height={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 text-base">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>

  <Footer />

  <style jsx global>{`
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out;
    }
    .animate-fade-in-delay {
      animation: fadeIn 1.4s ease-out;
    }

    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `}</style>
</>

); }

