import { useEffect, useState } from "react"; import { useRouter } from "next/router"; import { supabase } from "../utils/supabaseClient"; import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Dashboard() { const router = useRouter(); const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [notifyOnMessage, setNotifyOnMessage] = useState(false);

useEffect(() => { const fetchProfile = async () => { const { data: sessionData } = await supabase.auth.getSession(); const user = sessionData?.session?.user; if (!user) return router.push("/login");

const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) {
    setProfile(data);
    setNotifyOnMessage(data.notify_on_message);

    if (data.role === "Admin") {
      router.push("/admin-dashboard");
    }
  }
  setLoading(false);
};

fetchProfile();

}, []);

const handleSave = async () => { if (!profile) return;

const { error } = await supabase.from("profiles").update({
  notify_on_message: notifyOnMessage,
}).eq("id", profile.id);

if (!error) alert("Preferenze salvate");

};

if (loading) return <div className="p-6 text-white">Caricamento...</div>;

return ( <div className="min-h-screen bg-[#0f1e3c] text-white p-6"> <h1 className="text-3xl font-bold mb-6"> {profile?.role === "Admin" ? "Pannello di Controllo" : "Area Personale"} </h1>

{profile?.role !== "Admin" && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#1c2a4d] p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Lingua</h2>
        <LanguageSwitcher />
      </div>
      <div className="bg-[#1c2a4d] p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Tema</h2>
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Attiva Modalità Scura
        </button>
      </div>
      <div className="col-span-2 bg-[#1c2a4d] p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Dati Profilo</h2>
        <input
          type="text"
          value={profile.nome || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={profile.cognome || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={profile.city || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={profile.cap || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={profile.role || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={profile.category || ""}
          disabled
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <textarea
          value={profile.description || ""}
          disabled
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          rows={3}
        ></textarea>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={notifyOnMessage}
              onChange={() => setNotifyOnMessage(!notifyOnMessage)}
              className="mr-2"
            />
            Ricevi notifiche email quando ricevi un messaggio
          </label>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded"
        >
          Salva Modifiche
        </button>
      </div>
    </div>
  )}
</div>

); }

