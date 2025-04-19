
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600 dark:text-yellow-400 mb-4">404</h1>
      <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">
        Pagina non trovata.
      </p>
      <Link href="/">
        <a className="text-blue-500 dark:text-yellow-400 hover:underline text-lg">
          Torna alla home
        </a>
      </Link>
    </div>
  );
}
