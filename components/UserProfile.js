
import React from "react";

const UserProfile = ({ user }) => {
  if (!user) return <div className="text-center text-gray-500">Nessun utente selezionato.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto mt-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar || "/images/default-avatar.png"}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.nickname}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{user.ruolo}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Città:</strong> {user.citta}</p>
        <p><strong>Zona:</strong> {user.zona}</p>
        <p><strong>Categoria:</strong> {user.categoria}</p>
        <p className="mt-2"><strong>Descrizione:</strong> {user.descrizione}</p>
      </div>
    </div>
  );
};

export default UserProfile;
