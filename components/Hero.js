import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Testo a sinistra */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Connetti segnalatori e professionisti
          </h1>
          <p className="text-lg text-blue-100">
            La tua piattaforma per creare nuove collaborazioni, scoprire opportunità e far crescere il tuo network professionale.
          </p>

          {/* Icone decorative */}
          <div className="mt-8 flex space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-blue-100">Segnalatori</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-blue-100">Professionisti</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-blue-100">Collaborazioni</span>
            </div>
          </div>
        </div>

        {/* Immagine a destra */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/connect-hero.png"
            alt="Connessione tra utenti"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>

      </div>
    </section>
  );
}
