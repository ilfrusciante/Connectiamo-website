export default function ProfileCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-4">
        {user?.avatar ? (
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
          <h3 className="text-xl font-semibold text-blue-900 dark:text-white">{user?.nickname || 'Utente anonimo'}</h3>
          <p className="text-gray-700 dark:text-gray-300">{user?.role} - {user?.category}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.city}, {user?.area}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{user?.description}</p>
      <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded shadow w-full">
        Contatta
      </button>
    </div>
  );
}
