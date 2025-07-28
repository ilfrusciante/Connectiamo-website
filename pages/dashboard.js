import { useEffect, useState } from "react"; import { useRouter } from "next/router"; import { supabase } from "../utils/supabaseClient"; import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Dashboard() { const router = useRouter(); const [theme, setTheme] = useState("light"); const [notifications, setNotifications] = useState(true); const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true);

useEffect(() => { const getSessionAndProfile = async () => { const { data: { session }, error: sessionError, } = await supabase.auth.getSession();

if (!session) {
    router.push("/login");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !data) {
    router.push("/login");
    return;
  }

  if (data.role === "Admin") {
    router.push("/admin-dashboard");
    return;
  }

  setProfile(data);
  setNotifications(data.notify_on_message ?? true);
  setLoading(false);
};

getSessionAndProfile();

}, []);

const toggleTheme = () => { document.documentElement.classList.toggle("dark"); setTheme(theme === "light" ? "dark" : "light"); };

const toggleNotifications = () => { setNotifications(!notifications); };

const handleSave = async () => { if (!profile) return; await supabase.from("profiles").update({ notify_on_message: notifications, }).eq("id", profile.id); };

if (loading) return <div className="p-6 text-white">Caricamento...</div>;

return ( <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6"> <h1 className="text-3xl font-bold mb-6">Area Personale</h1> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"> <h2 className="text-xl font-semibold mb-2">Lingua</h2> <LanguageSwitcher /> </div> <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"> <h2 className="text-xl font-semibold mb-2">Tema</h2> <button
onClick={toggleTheme}
className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
> Attiva Modalità {theme === "light" ? "Scura" : "Chiara"} </button> </div> </div>

<div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Dati Profilo</h2>

    <input type="text" value={profile.nome} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <input type="text" value={profile.cognome} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <input type="text" value={profile.city} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <input type="text" value={profile.cap} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <input type="text" value={profile.role} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <input type="text" value={profile.category} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2" />
    <textarea value={profile.description} readOnly className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4" rows={3}></textarea>

    <label className="inline-flex items-center mb-4">
      <input
        type="checkbox"
        checked={notifications}
        onChange={toggleNotifications}
        className="form-checkbox h-5 w-5 text-yellow-500"
      />
      <span className="ml-2 text-sm">Ricevi notifiche email quando ricevi un messaggio</span>
    </label>

    <button
      onClick={handleSave}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded"
    >
      Salva Modifiche
    </button>
  </div>
</div>

); }

