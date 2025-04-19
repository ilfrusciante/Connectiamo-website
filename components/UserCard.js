
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 w-full max-w-sm">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar || "/images/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user.nickname}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.city}, {user.area}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.category}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{user.description}</p>
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
        Contatta
      </button>
    </div>
  );
};

export default UserCard;
