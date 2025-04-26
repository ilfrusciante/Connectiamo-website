import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [cap, setCap] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    if (!role || !city) {
      alert('Seleziona almeno il ruolo e la città.');
      return;
    }
    router.push(`/search-results?role=${role}&city=${city}&cap=${cap}&category=${category}`);
  };

  return (
    <>
      <Head>
        <title>Connectiamo</title>
      </Head>

      <main className="bg-white text-gray-900">

        {/* HERO SECTION */}
        <section className="bg-[#0f1e3c] text-white pt-20 pb-32 px-6 md:px-20 relative overflow-visible">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">

            {/* Testo */}
            <div className="md:w-1/2 space-y-6 z-10">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Connetti segnalatori <br /> e professionisti
              </h1>
              <p className="text-lg text-blue-100">
                Una piattaforma che mette in contatto segnalatori e professionisti per scopi di business e referral.
              </p>
            </div>

            {/* Immagine */}
            <div className="md:w-1/2 mt-10 md:mt-0 relative h-[300px] md:h-[420px] z-0 md:pl-4">
              <Image
                src="/images/connect-hero.png"
                alt="Professionisti"
                width={400}
                height={600}
                className="rounded-lg"
                priority
              />
            </div>
          </div>

        </section>

        {/* BARRA DI RICERCA */}
        <div className="relative z-20 -mt-24">
          <div className="w-full max-w-5xl mx-auto bg-yellow-400 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-4 md:gap-2 p-6">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:ring focus:ring-yellow-300"
            >
              <option value="">Ruolo</option>
              <option value="Professionista">Professionista</option>
              <option value="Connector">Connector</option>
            </select>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Città"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:ring focus:ring-yellow-300"
            />

            <input
              type="text"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              placeholder="CAP"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:ring focus:ring-yellow-300"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:ring focus:ring-yellow-300"
            >
              <option value="">Categoria</option>
              <option value="Edilizia">Edilizia</option>
              <option value="Benessere">Benessere</option>
              <option value="Tecnologie">Tecnologie</option>
              <option value="Servizi personali">Servizi personali</option>
              <option value="Servizi aziendali">Servizi aziendali</option>
              <option value="Altro">Altro</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md w-full md:w-auto transition"
            >
              Cerca
            </button>
          </div>
        </div>

        {/* CHI SIAMO */}
        <section className="py-24 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Chi siamo</h2>
            <p className="text-gray-800 text-lg">
              <strong>Connectiamo</strong> è una piattaforma che crea connessioni tra segnalatori e professionisti, aiutando figure come guide turistiche, portieri o receptionist a trovare pittori, ristrutturatori, parrucchieri e altri professionisti per referral e collaborazioni.
            </p>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="bg-gray-100 py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-10">Come funziona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step1-registrati.png" alt="Registrati" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">1 Registrati</h3>
                <p className="text-gray-600 text-base">Crea un profilo come segnalatore o professionista</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step2-trova.png" alt="Trova contatti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">2 Trova contatti</h3>
                <p className="text-gray-600 text-base">Usa la ricerca per trovare persone nella tua zona e categoria</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step3-connetti.png" alt="Connettiti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">3 Connettiti</h3>
                <p className="text-gray-600 text-base">Mettiti in contatto tramite messaggistica privata</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
