import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, zone, cap, category } = router.query;

  const filters = [
    { label: 'Ruolo', value: role },
    { label: 'Città', value: city },
    { label: 'Zona', value: zone },
    { label: 'CAP', value: cap },
    { label: 'Categoria', value: category },
  ];

  return (
    <>
      <Head>
        <title>Risultati Ricerca - Connectiamo</title>
      </Head>

      <main className="bg-gray-100 min-h-screen py-12 px-6 md:px-20 text-gray-900">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Risultati della ricerca</h1>

          {/* Parametri selezionati */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Filtri applicati:</h2>
            <ul className="list-disc pl-6 space-y-2">
              {filters
                .filter(filter => filter.value) // Mostra solo se il valore esiste
                .map((filter, index) => (
                  <li key={index}>
                    <strong>{filter.label}:</strong> {filter.value}
                  </li>
                ))}
            </ul>
          </div>

          {/* Risultati trovati */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Risultati trovati:</h2>
            <p>In questa sezione verranno mostrati i profili corrispondenti ai criteri di ricerca.</p>
            <p><em>(Funzionalità di ricerca reale sarà implementata successivamente)</em></p>
          </div>
        </div>
      </main>
    </>
  );
}
