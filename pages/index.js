import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Connectiamo</title>
      </Head>

      <main className="bg-white text-gray-900">

        {/* HERO SECTION */}
        <section className="bg-blue-800 text-white py-16 px-6 md:px-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Testo e barra */}
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Connetti segnalatori <br /> e professionisti
              </h1>
              <p className="text-lg text-blue-100">
                La tua piattaforma per creare nuove collaborazioni, scoprire opportunità e far crescere il tuo network professionale.
              </p>

              {/* Barra di ricerca */}
              <div className="bg-white rounded-xl shadow-lg flex flex-col sm:flex-row flex-wrap gap-3 p-4">
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Ruolo</option>
                </select>
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Città</option>
                </select>
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Zona</option>
                </select>
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Categoria</option>
                </select>
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md">
                  Cerca
                </button>
              </div>
            </div>

            {/* Immagine */}
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/connect-hero.png"
                alt="Professionisti con stretta di mano"
                width={500}
                height={400}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </section>

        {/* CHI SIAMO */}
        <section className="py-16 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">Chi siamo</h2>
            <p className="text-gray-800">
              <strong>Connectiamo</strong> è una piattaforma che crea connessioni tra segnalatori e professionisti,
              aiutando figure come guide turistiche, portieri o receptionist a trovare pittori, ristrutturatori, parrucchieri
              e altri professionisti per referrals e collaborazioni.
            </p>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="bg-gray-100 py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Come funziona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step1-registrati.png" alt="Registrati" width={80} height={80} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">1. Registrati</h3>
                <p className="text-gray-600">
                  Crea il tuo profilo gratuitamente.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step2-trova.png" alt="Trova contatti" width={80} height={80} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">2. Trova contatti</h3>
                <p className="text-gray-600">
                  Cerca profili filtrando per zona, ruolo e categoria.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <Image src="/images/step3-connetti.png" alt="Connettiti" width={80} height={80} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">3. Connettiti</h3>
                <p className="text-gray-600">
                  Manda un messaggio e inizia una conversazione privata.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
