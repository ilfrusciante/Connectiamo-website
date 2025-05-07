import Head from 'next/head'; import Image from 'next/image'; import { useState } from 'react'; import { useRouter } from 'next/router'; import Navbar from '../components/Navbar'; import Footer from '../components/Footer';

export default function Home() { const router = useRouter(); const [role, setRole] = useState(''); const [city, setCity] = useState(''); const [category, setCategory] = useState(''); const [cap, setCap] = useState('');

const handleSearch = () => { if (!role || !city) { alert('Seleziona almeno Ruolo e Città.'); return; } router.push(/search-results?role=${role}&city=${city}&category=${category}&cap=${cap}); };

return ( <> <Head> <title>Connectiamo</title> </Head>

<Navbar />

  <main className="bg-white text-gray-900">
    {/* HERO SECTION aggiornata */}
    <section className="bg-[#0f1e3c] text-white pt-24 pb-16 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Trova e connetti <br /> chi crea valore con chi lo cerca
          </h1>
          <p className="text-lg text-blue-100">
            Una piattaforma che valorizza i tuoi contatti: segnala, trova, collabora. Senza intermediazioni.
          </p>
          <div className="bg-yellow-400 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 p-4 mt-6">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300">
              <option value="">Ruolo</option>
              <option value="Professionista">Professionista</option>
              <option value="Connector">Connector</option>
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300">
              <option value="">Città</option>
              <option value="Milano">Milano</option>
              <option value="Roma">Roma</option>
              <option value="Napoli">Napoli</option>
            </select>
            <input type="text" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="CAP" className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300">
              <option value="">Categoria</option>
              <option value="Edilizia">Edilizia</option>
              <option value="Benessere">Benessere</option>
              <option value="Tecnologie">Tecnologie</option>
              <option value="Servizi personali">Servizi personali</option>
              <option value="Servizi aziendali">Servizi aziendali</option>
              <option value="Altro">Altro</option>
            </select>
            <button onClick={handleSearch} disabled={!role || !city} className={`font-semibold px-5 py-2 rounded-md w-full md:w-auto transition ${!role || !city ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              Cerca
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/animazione-connectiamo.gif"
            alt="Illustrazione animata connessioni"
            width={480}
            height={360}
            className="rounded-xl shadow-xl"
            priority
          />
        </div>
      </div>
    </section>

    {/* COME FUNZIONA */}
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
            <Image src="/images/step1-registrati.png" alt="Registrati" width={64} height={64} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">1 Registrati</h3>
            <p className="text-gray-600 text-base">Crea un profilo come segnalatore o professionista</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
            <Image src="/images/step2-trova.png" alt="Trova contatti" width={64} height={64} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">2 Trova contatti</h3>
            <p className="text-gray-600 text-base">Cerca per città, CAP e categoria</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
            <Image src="/images/step3-connetti.png" alt="Connettiti" width={64} height={64} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">3 Connettiti</h3>
            <p className="text-gray-600 text-base">Scrivi tramite messaggi privati</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</>

); }

