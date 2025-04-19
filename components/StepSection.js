export default function StepSection() {
  return (
    <section className="my-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 dark:text-white">Come funziona</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <img src="/images/register.svg" alt="Registrati" className="mx-auto h-16 mb-2" />
          <h3 className="font-semibold text-lg mb-1">1. Registrati</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Crea un profilo come segnalatore o professionista.
          </p>
        </div>
        <div>
          <img src="/images/search.svg" alt="Trova contatti" className="mx-auto h-16 mb-2" />
          <h3 className="font-semibold text-lg mb-1">2. Trova contatti</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Usa la ricerca per filtrare per zona, categoria, ruolo.
          </p>
        </div>
        <div>
          <img src="/images/connect.svg" alt="Connettiti" className="mx-auto h-16 mb-2" />
          <h3 className="font-semibold text-lg mb-1">3. Connettiti</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Manda un messaggio privato e accordati liberamente.
          </p>
        </div>
      </div>
    </section>
  );
}
