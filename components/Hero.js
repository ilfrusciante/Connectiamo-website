import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-blue-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connetti segnalatori e professionisti
          </h1>
          <p className="text-lg mb-6">
            Una piattaforma che mette in contatto segnalatori e professionisti
            per collaborazioni, referral e opportunità locali.
          </p>
        </div>

        {/* Immagine a destra */}
  <div className="md:w-1/2 flex justify-center">
    <Image 
      src="/images/hero-illustration.png" 
      alt="Illustrazione Hero" 
      width={400} 
      height={300} 
      className="rounded-lg"
    />
  </div>
</div>
    </section>
  );
}
