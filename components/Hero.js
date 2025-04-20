import Image from 'next/image';

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-blue-600 text-white p-8 rounded-xl">
      
      {/* Testo a sinistra */}
      <div className="md:w-1/2 mb-6 md:mb-0">
        <h1 className="text-3xl font-bold mb-4">
          Connetti segnalatori e professionisti
        </h1>
        <p className="text-lg">
          La tua piattaforma per creare nuove collaborazioni.
        </p>
      </div>

      {/* Immagine a destra */}
      <div className="md:w-1/2 flex justify-center">
        <Image
          src="/images/connect-hero.png"
          alt="Connessione tra professionisti"
          width={400}
          height={400}
          className="rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
}
