// pages/signup.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    nickname: '',
    email: '',
    password: '',
    role: 'Connector',
    city: '',
    cap: '',
    category: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateCityCap = async (city, cap) => {
    const response = await fetch(`https://api.zippopotam.us/it/${cap}`);
    if (!response.ok) return false;
    const data = await response.json();
    const matchingPlace = data.places.find((place) =>
      place['place name'].toLowerCase().includes(city.toLowerCase())
    );
    return !!matchingPlace;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { nome, cognome, nickname, email, password, role, city, cap, category, description } = formData;

    if (!nome || !cognome || !nickname || !email || !password || !role || !city || !cap) {
      setError('Tutti i campi obbligatori devono essere compilati.');
      return;
    }

    if (role === 'Professionista' && !category) {
      setError('La categoria è obbligatoria per i Professionisti.');
      return;
    }

    const isValidCityCap = await validateCityCap(city, cap);
    if (!isValidCityCap) {
      setError(`⚠️ Il CAP ${cap} non corrisponde alla città inserita: "${city}".`);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = data.user;

    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        nome,
        cognome,
        nickname,
        email,
        role,
        city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
        cap,
        category: role === 'Professionista' ? category : '',
        description,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess('Registrazione completata con successo!');
    router.push('/dashboard');
  };

  return (
    <div className="signup-container">
      <h2>Registrati</h2>
      <p>Crea un nuovo account per connetterti con altri professionisti.</p>
      <p><strong>Il tuo nome e cognome resteranno privati</strong> e non verranno mostrati ad altri utenti.<br />
         Solo il <strong>nickname</strong> sarà visibile pubblicamente.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} />
        <input name="cognome" placeholder="Cognome" onChange={handleChange} />
        <input name="nickname" placeholder="Nickname" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} type="email" />
        <input name="password" placeholder="Password" onChange={handleChange} type="password" />
        <select name="role" onChange={handleChange}>
          <option value="Connector">Connector</option>
          <option value="Professionista">Professionista</option>
        </select>
        <input name="city" placeholder="Città" onChange={handleChange} />
        <input name="cap" placeholder="CAP" onChange={handleChange} />
        {formData.role === 'Professionista' && (
          <select name="category" onChange={handleChange}>
            <option value="">Seleziona categoria</option>
            <option value="Turismo">Turismo</option>
            <option value="Ristorazione">Ristorazione</option>
            <option value="Servizi">Servizi</option>
            {/* Aggiungi altre categorie se necessario */}
          </select>
        )}
        <textarea name="description" placeholder="Descrizione (facoltativa)" onChange={handleChange} />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}
