import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function SearchBar({ role, setRole, city, setCity, category, setCategory, cap, setCap, onSearch }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase.from('profiles').select('city');
      if (!error && data) {
        // Filtra città uniche e non vuote
        const uniqueCities = Array.from(new Set(data.map(p => (p.city || '').trim()).filter(Boolean)));
        setCities(uniqueCities.sort((a, b) => a.localeCompare(b)));
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="bg-yellow-400 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
      >
        <option value="">Ruolo</option>
        <option value="Professionista">Professionista</option>
        <option value="Connector">Connector</option>
      </select>
      <select
        value={city}
        onChange={e => setCity(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
      >
        <option value="">Città</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <input
        type="text"
        value={cap}
        onChange={e => setCap(e.target.value)}
        placeholder="CAP"
        className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md border text-gray-800 w-full focus:ring focus:ring-yellow-300"
      >
        <option value="">Categoria</option>
        <option value="Edilizia">Edilizia</option>
        <option value="Benessere">Benessere</option>
        <option value="Tecnologie">Tecnologie</option>
        <option value="Servizi personali">Servizi personali</option>
        <option value="Servizi aziendali">Servizi aziendali</option>
        <option value="Ristorazione">Ristorazione</option>
        <option value="Intrattenimento">Intrattenimento</option>
        <option value="Altro">Altro</option>
      </select>
      <button
        onClick={onSearch}
        disabled={!role || !city}
        className={`font-semibold px-5 py-2 rounded-md w-full md:w-auto transition ${
          !role || !city
            ? 'bg-gray-300 cursor-not-allowed text-gray-600'
            : 'bg-[#d4a600] hover:bg-[#b89400] text-black'
        }`}
      >
        Trova contatti
      </button>
    </div>
  );
}
