import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SearchResults() {
  const router = useRouter();
  const { role, city, zone, cap, category } = router.query;

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Dati finti simulati (in futuro li prenderemo da Supabase)
    const allProfiles = [
      {
        id: 1,
        name: 'Mario Rossi',
        role: 'Professionista',
        city: 'Milano',
        zone: 'Centro',
        cap: '20122',
        category: 'Edilizia',
        image: '/images/user1.png',
      },
      {
        id: 2,
        name: 'Lucia Bianchi',
        role: 'Connector',
        city: 'Roma',
        zone: 'Sud',
        cap: '00184',
        category: 'Benessere',
        image: '/images/user2.png',
      },
      {
        id: 3,
        name: 'Giovanni Verdi',
        role: 'Professionista',
        city: 'Napoli',
        zone: 'Nord',
        cap: '80100',
        category: 'Tecnologie',
        image: '/images/user3.png',
      },
    ];

    if (role || city || zone || cap || category) {
      const filtered = allProfiles.filter(profile =>
        (!role || profile.role === role) &&
        (!city || profile.city.toLowerCase() === city.toLowerCase()) &&
        (!zone || profile.zone === zone) &&
        (!cap || profile.cap === cap) &&
        (!category || profile.category === category)
      );
      setProfiles(filtered);
    }
  }, [role, city, zone, cap, category]);

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
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
              </div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.city}</p>
              <p className="text-gray-500">{profile.zone} - CAP {profile.cap}</p>
              <p className="text-gray-500">{profile.category}</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => alert('Devi essere registrato o loggato per contattare')}
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
