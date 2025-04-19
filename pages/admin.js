import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error) setUsers(data || []);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Area Admin</h1>
      {loading ? (
        <p>Caricamento utenti...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">ID</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Nickname</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Email</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Ruolo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{user.id}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{user.nickname}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{user.ruolo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
