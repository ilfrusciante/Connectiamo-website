import { useState, useEffect, useRef, useCallback } from 'react';

export default function CityAutocomplete({ value, onChange, onCitySelect, placeholder, className }) {
  console.log('CityAutocomplete component montato');
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log('useEffect iniziale attivato');
    const loadCities = async () => {
      try {
        console.log('Caricamento città in corso...');
        
        // Provo prima comuni.json, poi gi_comuni.json
        let response = await fetch('/comuni.json');
        let data;
        
        if (!response.ok) {
          console.log('comuni.json non trovato, provo gi_comuni.json...');
          response = await fetch('/gi_comuni.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        data = await response.json();
        console.log('Dati caricati:', data.length, 'comuni trovati');
        console.log('Tipo di data:', typeof data);
        console.log('È un array?', Array.isArray(data));
        
        if (Array.isArray(data) && data.length > 0) {
          console.log('Primo comune:', data[0]);
          console.log('Keys del primo comune:', Object.keys(data[0]));
        } else {
          console.error('Data non è un array o è vuoto:', data);
          return;
        }
        
        // Estraggo le città uniche con i loro CAP
        const cityMap = new Map();
        console.log('Elaborazione dati in corso...');
        
        data.forEach((comune, index) => {
          if (index < 5) {
            console.log(`Comune ${index}:`, comune);
          }
          
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
          } else {
            // Debug per capire la struttura
            if (index < 10) {
              console.log(`Comune ${index} senza nome o cap:`, comune);
              console.log('Keys disponibili:', Object.keys(comune));
            }
          }
        });
        
        console.log('CityMap size:', cityMap.size);
        console.log('Prime 3 città dalla map:', Array.from(cityMap.entries()).slice(0, 3));
        
        const citiesWithCaps = Array.from(cityMap.entries()).map(([city, caps]) => ({
          name: city,
          caps: caps.sort()
        }));
        
        console.log('Città elaborate:', citiesWithCaps.length);
        console.log('Prime 3 città:', citiesWithCaps.slice(0, 3));
        
        setCities(citiesWithCaps);
      } catch (error) {
        console.error('Errore nel caricamento delle città:', error);
        console.error('Stack trace:', error.stack);
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
      console.log('Città non ancora caricate');
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