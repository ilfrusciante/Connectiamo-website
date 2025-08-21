import { useState, useEffect, useRef, useCallback } from 'react';

export default function CityAutocomplete({ value, onChange, onCitySelect, placeholder, className }) {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        
        // Provo prima comuni.json, poi gi_comuni.json
        let response = await fetch('/comuni.json');
        let data;
        
        if (!response.ok) {
          response = await fetch('/gi_comuni.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Estraggo le città uniche con i loro CAP
          const cityMap = new Map();
          
          data.forEach((comune, index) => {
            
            // Verifico la struttura del comune
            if (comune.nome && comune.cap && Array.isArray(comune.cap)) {
              const cityName = comune.nome.trim();
              if (cityName) {
                if (!cityMap.has(cityName)) {
                  cityMap.set(cityName, []);
                }
                // Aggiungo tutti i CAP disponibili
                comune.cap.forEach(cap => {
                  if (cap && cap.toString().trim() !== '') {
                    cityMap.get(cityName).push(cap.toString());
                  }
                });
              }
            }
          });
          
          const citiesWithCaps = Array.from(cityMap.entries()).map(([city, caps]) => ({
            name: city,
            caps: caps.sort()
          }));
          
          setCities(citiesWithCaps);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle città:', error);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Gestione click esterni per chiudere i dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mostra il dropdown quando ci sono risultati filtrati
  useEffect(() => {
    if (filteredCities.length > 0) {
      setShowDropdown(true);
    }
  }, [filteredCities]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    onChange(input); // Aggiorno sempre il valore padre
    
    if (input.trim() === '') {
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }

    if (cities.length === 0) {
      return;
    }

    // Filtro immediato senza debounce per test
    const filtered = cities.filter(city => 
      city.name.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredCities(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleCitySelect = (city) => {
    setInputValue(city.name);
    setShowDropdown(false);
    setFilteredCities([]);
    onChange(city.name);
    onCitySelect(city.caps); // Passo sempre tutti i CAP disponibili
  };

  const handleInputFocus = () => {
    // Mostra il dropdown se ci sono risultati filtrati o se l'utente ha già digitato qualcosa
    if (inputValue.trim() !== '') {
      if (filteredCities.length > 0) {
        setShowDropdown(true);
      } else if (cities.length > 0) {
        // Se non ci sono risultati filtrati ma ci sono città caricate, filtra di nuovo
        const filtered = cities.filter(city => 
          city.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredCities(filtered);
        setShowDropdown(filtered.length > 0);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleCitySelect(city)}
              >
                <div className="font-medium">{city.name}</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              Nessuna città trovata
            </div>
          )}
        </div>
      )}
    </div>
  );
} 