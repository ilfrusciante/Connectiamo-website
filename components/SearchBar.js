export default function SearchBar() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
      <select className="w-full md:w-1/4 p-2 rounded border dark:bg-gray-900 dark:border-gray-700 dark:text-white">
        <option>Ruolo</option>
        <option>Segnalatore</option>
        <option>Professionista</option>
      </select>
      <select className="w-full md:w-1/4 p-2 rounded border dark:bg-gray-900 dark:border-gray-700 dark:text-white">
        <option>Città</option>
        <option>Tutta la città</option>
        <option>Roma</option>
        <option>Milano</option>
        <option>Napoli</option>
      </select>
      <select className="w-full md:w-1/4 p-2 rounded border dark:bg-gray-900 dark:border-gray-700 dark:text-white">
        <option>Zona</option>
        <option>Centro</option>
        <option>Trastevere</option>
        <option>Eur</option>
      </select>
      <select className="w-full md:w-1/4 p-2 rounded border dark:bg-gray-900 dark:border-gray-700 dark:text-white">
        <option>Categoria</option>
        <option>Ristoranti</option>
        <option>Pittori</option>
        <option>Parrucchieri</option>
        <option>Ristorazione</option>
        <option>Intrattenimento</option>
      </select>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow w-full md:w-auto">
        Cerca
      </button>
    </div>
  );
}
