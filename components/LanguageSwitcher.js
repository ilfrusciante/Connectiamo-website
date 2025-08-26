import { useState } from 'react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState('it');

  const handleChange = (e) => {
    setLanguage(e.target.value);
    console.log('Lingua selezionata:', e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white text-sm rounded px-2 py-1"
      >
        <option value="it">IT</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
