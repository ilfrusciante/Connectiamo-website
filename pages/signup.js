import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AvatarUpload from '../components/AvatarUpload';
import CityAutocomplete from '../components/CityAutocomplete';
import Footer from '../components/Footer';
import { sendEmail } from '../utils/emailService';

export default function Signup() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [cap, setCap] = useState('');
  const [availableCaps, setAvailableCaps] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [notifyOnMessage, setNotifyOnMessage] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase();

  const handleAvatarUpload = (file) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleCitySelect = (caps) => {
    if (caps && caps.length > 0) {
      setAvailableCaps(caps); // Popolo i CAP disponibili
      setCap(caps[0]); // Imposto il primo CAP come default
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    
    // Validazione termini e condizioni
    if (!acceptTerms) {
      setError('Devi accettare i termini e condizioni per continuare.');
      setUploading(false);
      return;
    }
    
    const normalizedCity = normalize(city);

    try {
      const res = await fetch(`https://secure.geonames.org/postalCodeLookupJSON?postalcode=${cap}&maxRows=10&username=RobyRob`);
      if (!res.ok) throw new Error('Errore nella richiesta a GeoNames');
      const data = await res.json();
      const places = data.postalcodes || [];

      const match = places.some((place) => {
        const placeName = normalize(place.placeName || '');
        const adminName2 = normalize(place.adminName2 || '');
        return (
          placeName.includes(normalizedCity) ||
          normalizedCity.includes(placeName) ||
          adminName2.includes(normalizedCity) ||
          normalizedCity.includes(adminName2)
        );
      });

      if (!match) {
        setError(`⚠️ Il CAP ${cap} non corrisponde alla città inserita: "${city}".`);
        setUploading(false);
        return;
      }
    } catch (err) {
      setError('Errore nella verifica del CAP: ' + err.message);
      setUploading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setUploading(false);
      return;
    }

    const userId = signUpData.user?.id;
    let avatarUrl = '';

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) {
        console.error('Errore upload avatar:', uploadError);
      } else {
        avatarUrl = uploadData.path;
      }
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          nome,
          cognome,
          nickname,
          email,
          role,
          city,
          cap,
          category,
          description,
          notify_on_message: notifyOnMessage,
          avatar_url: avatarUrl
        }
      ]);

    if (profileError) {
      setError(profileError.message);
      setUploading(false);
      return;
    }

    // Invia email di benvenuto
    try {
      const welcomeEmailContent = {
        to: email,
        subject: 'Benvenuto su Connectiamo! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #0f1e3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Connectiamo</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0f1e3c; margin-bottom: 20px;">Benvenuto su Connectiamo!</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Ciao <strong>${nickname}</strong>,
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Grazie per esserti registrato su Connectiamo! La tua registrazione è stata completata con successo.
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                <strong>I tuoi dati di accesso:</strong><br>
                Email: ${email}<br>
                Nickname: ${nickname}
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">
                Inizia subito a fare network con professionisti o connector della tua zona!
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://connectiamo.com'}" 
                   style="background-color: #0f1e3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Inizia a Connetterti
                </a>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                Se hai domande, non esitare a contattarci all'indirizzo info@connectiamo.com
              </p>
              <p style="color: #999; font-size: 10px; margin-top: 20px; text-align: center; line-height: 1.4;">
                Se non ti sei iscritto su connectiamo.com e ritieni di aver ricevuto questo messaggio per errore contattaci su info@connectiamo.com per la rimozione.
              </p>
            </div>
          </div>
        `
      };

      await sendEmail(welcomeEmailContent);
      console.log('Email di benvenuto inviata con successo');
    } catch (emailError) {
      console.error('Errore nell\'invio email di benvenuto:', emailError);
      // Non blocchiamo la registrazione se l'email fallisce
    }

    setUploading(false);
    setShowSuccessModal(true);
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <>
    <div className="min-h-screen bg-[#0f1e3c] text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full p-6">
        <div className="w-full flex justify-center mb-6">
          <Image src="/images/illustration-signup.png" alt="Registrazione" width={0} height={0} sizes="100vw" style={{ width: '100%', maxWidth: '360px', height: 'auto' }} className="rounded-md" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">Registrati</h2>
        <p className="text-center text-gray-300 text-sm mb-4">
          Crea un nuovo account per connetterti con altri professionisti.
        </p>
        <p className="text-xs text-yellow-300 text-center mb-6">
          Il tuo <strong>nome e cognome resteranno privati</strong> e non verranno mostrati ad altri utenti. <br />
          Solo il <strong>nickname</strong> sarà visibile pubblicamente.
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <AvatarUpload onUpload={handleAvatarUpload} previewUrl={avatarPreview} />
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required placeholder="Cognome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Nickname" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />

          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
            className="w-full px-3 py-2 rounded bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Seleziona ruolo</option>
            <option value="Cerco clienti">Cerco clienti</option>
            <option value="Procuro clienti">Procuro clienti</option>
            <option value="Collaborazione">Collaborazione</option>
          </select>

          <div className="flex space-x-4">
            <div className="w-2/3">
              <CityAutocomplete
                value={city}
                onChange={setCity}
                onCitySelect={handleCitySelect}
                placeholder="Città"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <select 
              value={cap} 
              onChange={(e) => setCap(e.target.value)} 
              required 
              className="w-1/3 px-3 py-2 rounded bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundSize: '1.5em 1.5em'
              }}
              disabled={availableCaps.length === 0}
            >
              <option value="">CAP</option>
              {availableCaps.map((capOption, index) => (
                <option key={index} value={capOption}>
                  {capOption}
                </option>
              ))}
            </select>
          </div>

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required 
            className="w-full px-3 py-2 rounded bg-gray-700 text-white appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Seleziona categoria</option>
            <option value="Edilizia">Edilizia</option>
            <option value="Benessere">Benessere</option>
            <option value="Servizi personali">Servizi personali</option>
            <option value="Servizi aziendali">Servizi aziendali</option>
            <option value="Ristorazione">Ristorazione</option>
            <option value="Turismo">Turismo</option>
            <option value="Altro">Altro</option>
          </select>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione (facoltativa)" className="w-full px-3 py-2 rounded bg-gray-700 text-white" rows={3}></textarea>

          <label className="flex items-center space-x-2 text-sm text-gray-200">
            <input type="checkbox" checked={notifyOnMessage} onChange={(e) => setNotifyOnMessage(e.target.checked)} />
            <span>Voglio ricevere una mail quando ricevo un messaggio</span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-gray-200">
            <input 
              type="checkbox" 
              checked={acceptTerms} 
              onChange={(e) => setAcceptTerms(e.target.checked)} 
              required
            />
            <span>
              Accetto i{' '}
              <a 
                href="/termini-e-condizioni" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                termini e condizioni
              </a>
            </span>
          </label>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded" disabled={uploading}>
            {uploading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-xs mx-auto">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Grazie per esserti registrato</h2>
            <p className="text-gray-700 mb-2">Verrai reindirizzato alla home...</p>
          </div>
        </div>
      )}
      
    </div>
    <Footer />
    </>
  );
} 
