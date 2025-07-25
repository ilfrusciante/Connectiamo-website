import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [cap, setCap] = useState('');

  const handleSearch = () => {
    if (!role || !city) {
      alert('Seleziona almeno Ruolo e Città.');
      return;
    }
    router.push(`/search-results?role=${role}&city=${city}&category=${category}&cap=${cap}`);
  };

  const handleDiscover = () => {
    router.push('/search-results');
  };

  return (
    <>
      <Head>
        <title>Connectiamo</title>
      </Head>

      <main className="bg-white text-gray-900">
        {/* HERO */}
        <section className="bg-[#0f1e3c] text-white pt-20 pb-12 px-6 md:px-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 max-w-xl space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                <span className="block">Trova chi conosce e,</span>
                <span className="block text-yellow-400">fatti conoscere</span>
              </h1>
              <p className="text-lg text-blue-100">
                Connettiti con chi ha una rete di contatti o offri il tuo talento. Costruisci relazioni di valore per il tuo lavoro o la tua attività.
              </p>
              <button
                onClick={handleDiscover}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-md shadow transition"
              >
                Scopri subito
              </button>
            </div>

            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
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
        <section className="bg-white py-10 px-6 md:px-20 flex justify-center">
          <div className="w-full max-w-4xl">
            <SearchBar
              role={role}
              setRole={setRole}
              city={city}
              setCity={setCity}
              category={category}
              setCategory={setCategory}
              cap={cap}
              setCap={setCap}
              onSearch={handleSearch}
            />
          </div>
        </section>

        {/* CHI SIAMO */}
        <section className="py-16 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Chi siamo</h2>
            <p className="text-gray-800 text-lg">
              <strong>Connectiamo</strong> nasce per creare connessioni utili e concrete. Che tu sia un segnalatore o un professionista, qui puoi valorizzare la tua rete e far crescere il tuo lavoro.
            </p>
            <p className="text-gray-800 text-lg">
              Trova contatti affidabili, scambia opportunità e gestisci tutto dalla tua area personale con una <strong>chat integrata</strong>.
            </p>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="bg-gray-100 py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-10">
              <Link
                href="/come-funziona"
                className="text-black hover:underline cursor-pointer transition"
              >
                Come funziona
              </Link>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step1-registrati.png" alt="Registrati" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">1 Registrati</h3>
                <p className="text-gray-600 text-base">Crea un profilo come segnalatore o professionista</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step2-trova.png" alt="Trova contatti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">2 Trova contatti</h3>
                <p className="text-gray-600 text-base">Cerca per zona, ruolo e categoria</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step3-connetti.png" alt="Connettiti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">3 Connettiti</h3>
                <p className="text-gray-600 text-base">Scrivi nella chat privata e inizia subito</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
