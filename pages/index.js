{/* HERO */}
<section className="bg-[#0f1e3c] text-white pt-20 pb-12 px-6 md:px-20">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
    <div className="w-full md:w-1/2 z-10 text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold leading-[1.2] text-balance max-w-[16ch] mx-auto md:mx-0">
        Trova chi conosce e, <br />
        <span className="text-yellow-400">fatti conoscere</span>
      </h1>
      <p className="text-lg text-blue-100 mt-6 max-w-md mx-auto md:mx-0">
        Connettiti con chi ha una rete di contatti o offri il tuo talento. Costruisci relazioni di valore per il tuo lavoro o la tua attività.
      </p>
      <div className="mt-6">
        <button
          onClick={handleDiscover}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-md shadow transition"
        >
          Scopri subito
        </button>
      </div>
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
