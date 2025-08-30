import Footer from '../components/Footer';

export default function Contatti() {
  return (
    <>
      <div className="min-h-screen bg-[#0f1e3c] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Contatti e supporto</h1>
          
          <div className="space-y-8 text-sm leading-relaxed">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Hai domande su Connectiamo?</h2>
              <p className="mb-3">
                Hai domande su Connectiamo o vuoi saperne di più sulle opportunità che la nostra piattaforma può offrirti?
              </p>
              <p className="text-gray-300 italic">
                Siamo a disposizione per chiarimenti, suggerimenti e collaborazioni.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Supporto tecnico</h2>
              <p className="mb-3">
                Hai necessità di supporto tecnico nell'uso di Connectiamo?
              </p>
              <p className="text-gray-300 italic">
                Il nostro team è pronto ad aiutarti con qualsiasi problema tecnico.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Come contattarci</h2>
              <p className="mb-3">
                Per qualunque necessità puoi contattarci a:
              </p>
              <div className="space-y-3">
                <p><strong>Email:</strong> <a href="mailto:info@connectiamo.com" className="text-yellow-400 hover:text-yellow-300 underline">info@connectiamo.com</a></p>
                <p><strong>Sede operativa:</strong> Roma, Italia</p>
              </div>
            </div>

            <div className="bg-yellow-400 text-black p-6 rounded-lg text-center">
              <p className="text-lg font-semibold">
                👉 Ti risponderemo nel più breve tempo possibile! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
