
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, category } = router.query;

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Simulazione dati finti (in futuro qui chiamerai Supabase)
    const allProfiles = [
      { id: 1, name: 'Mario Rossi', role: 'Professionista', city: 'Milano', category: 'Edilizia', image: '/images/user1.png' },
      { id: 2, name: 'Lucia Bianchi', role: 'Professionista', city: 'Roma', category: 'Benessere', image: '/images/user2.png' },
      { id: 3, name: 'Giovanni Verdi', role: 'Professionista', city: 'Napoli', category: 'Tecnologie', image: '/images/user3.png' },
    ];

    if (role || city || category) {
      const filtered = allProfiles.filter(profile =>
        (!role || profile.role === role) &&
        (!city || profile.city === city) &&
        (!category || profile.category === category)
      );
      setProfiles(filtered);
    }
  }, [role, city, category]);

  return (
    <main className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Risultati della ricerca</h1>

      {profiles.length === 0 ? (
        <p className="text-gray-700">Nessun profilo trovato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-gray-100 rounded-xl shadow p-6 text-center">
              <div className="mb-4">
                <Image src={profile.image} alt={profile.name} width={80} height={80} className="rounded-full mx-auto" />
              </div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.city}</p>
              <p className="text-gray-500">{profile.category}</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => alert('Devi essere registrato per contattare')}
              >
                Contatta
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
