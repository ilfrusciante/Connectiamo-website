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
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative z-0">
              <Image
                src="/images/connect-hero.png"
                alt="Professionisti"
                width={600}
                height={480}
                className="rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Barra di ricerca - Responsive */}
          <div className="w-full max-w-5xl px-4 md:px-0 absolute left-1/2 transform -translate-x-1/2 md:-bottom-8 bottom-4 z-20">
            <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-3 md:gap-2 p-4 md:p-5 md:w-[80%] md:ml-0 md:translate-x-12">
              <select className="flex-1 px-3 py-2 rounded-md border text-gray-700 w-full">
