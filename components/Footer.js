export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-6 mt-12 text-center text-sm text-gray-600 dark:text-gray-300">
      <div className="max-w-5xl mx-auto">
        <p className="mb-2 font-semibold text-lg text-blue-900 dark:text-white">Connectiamo</p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Chi siamo</a>
          <a href="#" className="hover:underline">Contatti</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Connectiamo. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}
