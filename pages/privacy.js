
import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Connectiamo</title>
      </Head>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">
            Questa è una pagina informativa sulla privacy. Inserisci qui il contenuto della tua informativa ai sensi delle normative vigenti.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc at euismod luctus, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc.
          </p>
        </div>
      </div>
    </>
  );
}
