
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 w-full max-w-sm">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
          />
        ) : (
          <span className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
              <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
            </svg>
          </span>
        )}
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
