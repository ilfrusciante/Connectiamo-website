import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Connectiamo</title>
      </Head>

      <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">

        {/* HERO SECTION */}
        <section className="bg-blue-800 text-white py-16 px-6 md:px-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            
            {/* Testo e barra */}
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Connetti segnalatori <br /> e professionisti
              </h1>
              <p className="text-lg text-blue-100">
                Una piattaforma che mette in contatto segnalatori e professionisti per scopi di business e referral
              </p>

              {/* Barra di ricerca */}
              <div className="bg-white rounded-xl shadow-lg flex flex-wrap gap-2 p-4">
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Ruolo</option>
                </select>
                <select className="flex-1 px-3 py-2 rounded-md border text-gray-700">
                  <option>Città</option>
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
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <Image
                src="/images/connect-hero.png"
                alt="Professionisti che si stringono la mano"
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
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chi siamo</h2>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Connectiamo</strong> è una piattaforma che crea connessioni tra segnalatori e professionisti,
              aiutando figure come guide turistiche, portieri o receptionist a trovare pittori, ristrutturatori, parrucchieri
              e altri professionisti per referrals e collaborazioni.
            </p>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-10 text-center md:text-left">Come funziona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
                <Image src="/images/step1-registrati.png" alt="Registrati" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">1 Registrati</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crea un profilo come segnalatore o professionista
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
                <Image src="/images/step2-trova.png" alt="Trova contatti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">2 Trova contatti</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Usa la nostra ricerca per trovare professionisti nella tua zona
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center">
                <Image src="/images/step3-connetti.png" alt="Connettiti" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">3 Connettiti</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Invia un messaggio e inizia una conversazione privata
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
