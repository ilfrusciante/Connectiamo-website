export default function ProfileCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar || '/images/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
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
