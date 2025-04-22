import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative bg-[#0f1e3c] text-white pt-20 pb-52 px-6 md:px-20 min-h-[600px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full relative z-10">
          
          {/* Colonna Testo */}
          <div className="md:w-1/2 space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Connetti segnalatori <br /> e professionisti
            </h1>
            <p className="text-lg text-blue-100">
              Una piattaforma che mette in contatto segnalatori e professionisti per scopi di business e referral.
            </p>
          </div>

          {/* Colonna Immagine */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center h-[300px] md:h-[350px]">
            <Image
              src="/images/connect-hero.png"
              alt="Professionisti"
              width={600}
              height={480}
              className="w-auto h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* BARRA DI RICERCA */}
        <div className="md:absolute md:left-1/2 md:-translate-x-[52%] md:bottom-44 z-50 w-full max-w-5xl px-4 md:px-0">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-2 p-4 md:p-5 w-full md:w-[500px]">
            <select className="flex-1 px-3 py-2 rounded-md border text-gray-700 w-full focus:ring focus:ring-yellow-300">
              <option>Ruolo</option>
            </select>
            <select className="flex-1 px-3 py-2 rounded-md border text-gray-700 w-full focus:ring focus:ring-yellow-300">
              <option>Città</option>
            </select>
            <select className="flex-1 px-3 py-2 rounded-md border text-gray-700 w-full focus:ring focus:ring-yellow-300">
              <option>Categoria</option>
            </select>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-md font-semibold">
              Cerca
            </button>
          </div>
        </div>
      </section>

      {/* SEZIONE CHI SIAMO */}
      <section className="py-16 px-6 md:px-20 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Chi siamo</h2>
          <p className="text-lg">
            <strong>Connectiamo</strong> è una piattaforma che crea connessioni tra segnalatori e professionisti,
            aiutando figure come guide turistiche, portieri o receptionist a trovare pittori, ristrutturatori,
            parrucchieri e altri professionisti per referral e collaborazioni.
          </p>
        </div>
      </section>

      {/* SEZIONE COME FUNZIONA */}
      <section className="bg-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <Image src="/images/step1-icon.png" alt="Step 1" width={60} height={60} className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold">1 Registrati</h3>
              <p>Crea un profilo come segnalatore o professionista</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image src="/images/step2-icon.png" alt="Step 2" width={60} height={60} className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold">2 Trova contatti</h3>
              <p>Usa la ricerca per trovare persone nella tua zona e categoria</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image src="/images/step3-icon.png" alt="Step 3" width={60} height={60} className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold">3 Connettiti</h3>
              <p>Mettiti in contatto tramite messaggistica privata</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
