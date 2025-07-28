import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Impostazioni() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(false); // default: false
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;
      setUserId(userId);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("notify_on_message")
        .eq("id", userId)
        .single();

      if (!error && profile) {
        setNotifications(!!profile.notify_on_message);
      }
    };

    getSessionAndProfile();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);

    if (userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ notify_on_message: newValue })
        .eq("id", userId);

      if (error) {
        console.error("Errore nel salvataggio delle preferenze:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Impostazioni</h1>
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Lingua</h2>
          <LanguageSwitcher />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Tema</h2>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Attiva Modalità {theme === "light" ? "Scura" : "Chiara"}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Notifiche Email</h2>
          <button
            onClick={toggleNotifications}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            {notifications ? "Disattiva" : "Attiva"} Notifiche Email
          </button>
        </div>
      </div>
    </div>
  );
}
