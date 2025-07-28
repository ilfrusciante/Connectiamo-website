import { useEffect, useState } from "react"; import { useRouter } from "next/router"; import { supabase } from "../utils/supabaseClient"; import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Dashboard() { const router = useRouter(); const [userId, setUserId] = useState(null); const [profile, setProfile] = useState({}); const [loading, setLoading] = useState(true); const [theme, setTheme] = useState("light");

useEffect(() => { const fetchData = async () => { const { data: sessionData } = await supabase.auth.getSession(); const user = sessionData.session?.user; if (!user) return router.push("/login"); setUserId(user.id);

const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!error && data) {
    setProfile(data);
  }
  setLoading(false);
};
fetchData();

}, []);

const handleChange = (e) => { const { name, value, type, checked } = e.target; setProfile((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value, })); };

const handleUpdate = async () => { setLoading(true); const { error } = await supabase.from("profiles").update(profile).eq("id", userId); if (error) alert("Errore durante l'aggiornamento del profilo"); else alert("Profilo aggiornato con successo!"); setLoading(false); };

const toggleTheme = () => { document.documentElement.classList.toggle("dark"); setTheme(theme === "light" ? "dark" : "light"); };

if (loading) return <p className="p-6">Caricamento...</p>;

return ( <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6"> <h1 className="text-3xl font-bold mb-6">Area Personale</h1> <div className="space-y-6">

{/* Lingua e Tema */}
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Lingua</h2>
        <LanguageSwitcher />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Tema</h2>
        <button onClick={toggleTheme} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Attiva Modalità {theme === "light" ? "Scura" : "Chiara"}
        </button>
      </div>
    </div>

    {/* Modifica Profilo */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Dati Profilo</h2>
      <div className="space-y-3">
        <input type="text" name="nome" value={profile.nome || ''} onChange={handleChange} placeholder="Nome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
        <input type="text" name="cognome" value={profile.cognome || ''} onChange={handleChange} placeholder="Cognome" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
        <input type="text" name="nickname" value={profile.nickname || ''} onChange={handleChange} placeholder="Nickname" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
        <input type="text" name="city" value={profile.city || ''} onChange={handleChange} placeholder="Città" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
        <input type="text" name="cap" value={profile.cap || ''} onChange={handleChange} placeholder="CAP" className="w-full px-3 py-2 rounded bg-gray-700 text-white" />

        <select name="role" value={profile.role || ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-white">
          <option value="">Ruolo</option>
          <option value="Professionista">Professionista</option>
          <option value="Connector">Connector</option>
        </select>

        <select name="category" value={profile.category || ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-white">
          <option value="">Categoria</option>
          <option value="Edilizia">Edilizia</option>
          <option value="Benessere">Benessere</option>
          <option value="Servizi personali">Servizi personali</option>
          <option value="Servizi aziendali">Servizi aziendali</option>
          <option value="Ristorazione">Ristorazione</option>
          <option value="Turismo">Turismo</option>
          <option value="Altro">Altro</option>
        </select>

        <textarea name="description" value={profile.description || ''} onChange={handleChange} placeholder="Descrizione" rows={3} className="w-full px-3 py-2 rounded bg-gray-700 text-white"></textarea>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="notify_on_message" checked={!!profile.notify_on_message} onChange={handleChange} className="form-checkbox text-yellow-500" />
          <span>Ricevi notifiche email quando ricevi un messaggio</span>
        </label>

        <button onClick={handleUpdate} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded">
          Salva Modifiche
        </button>
      </div>
    </div>
  </div>
</div>

); }

