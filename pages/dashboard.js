import { useEffect, useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../utils/supabaseClient';

export default function Dashboard() { const router = useRouter(); const { role, city, category, cap } = router.query; const [profiles, setProfiles] = useState([]); const [loading, setLoading] = useState(true); const [user, setUser] = useState(null); const [currentProfile, setCurrentProfile] = useState(null); const [editData, setEditData] = useState({ nickname: '', city: '', cap: '', description: '' }); const [blocked, setBlocked] = useState([]); const [deleted, setDeleted] = useState([]);

useEffect(() => { const checkUser = async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) return router.push('/login'); setUser(session.user); }; checkUser(); }, []);

useEffect(() => { if (user) fetchProfile(); }, [user]);

const fetchProfile = async () => { const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single(); setCurrentProfile(data); setEditData({ nickname: data.nickname || '', city: data.city || '', cap: data.cap || '', description: data.description || '', }); fetchBlocked(); fetchDeleted(); fetchProfiles(); };

const fetchProfiles = async () => { setLoading(true); let query = supabase.from('profiles').select('*').neq('id', user.id); if (role) query = query.eq('role', role); if (city) query = query.ilike('city', %${city}%); if (category) query = query.ilike('category', %${category}%); if (cap) query = query.ilike('cap', %${cap}%); const { data } = await query; setProfiles(data || []); setLoading(false); };

const fetchBlocked = async () => { const { data } = await supabase.from('blocked_contacts').select('blocked_user_id').eq('user_id', user.id); setBlocked(data.map((row) => row.blocked_user_id)); };

const fetchDeleted = async () => { const { data } = await supabase.from('deleted_contacts').select('deleted_user_id').eq('user_id', user.id); setDeleted(data.map((row) => row.deleted_user_id)); };

const handleSave = async () => { const { error } = await supabase.from('profiles').update(editData).eq('id', user.id); if (!error) fetchProfile(); };

if (loading || !currentProfile) return <p className="text-center mt-10">Caricamento...</p>;

return ( <div className="max-w-5xl mx-auto py-10 px-6 md:px-20 text-white"> <h2 className="text-2xl font-bold mb-6">Area personale</h2>

{/* Sezione modifica profilo */}
  <div className="bg-[#1f2a48] p-6 rounded-xl mb-10">
    <h3 className="text-xl font-semibold mb-4">Modifica profilo</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input value={editData.nickname} onChange={(e) => setEditData({ ...editData, nickname: e.target.value })} placeholder="Nickname" className="bg-gray-700 p-2 rounded" />
      <input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} placeholder="Città" className="bg-gray-700 p-2 rounded" />
      <input value={editData.cap} onChange={(e) => setEditData({ ...editData, cap: e.target.value })} placeholder="CAP" className="bg-gray-700 p-2 rounded" />
      <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Descrizione" className="bg-gray-700 p-2 rounded col-span-2" rows={3} />
    </div>
    <button onClick={handleSave} className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold">Salva modifiche</button>
  </div>

  {/* Contatti visibili */}
  <h3 className="text-xl font-bold mb-4">Contatti attivi</h3>
  {profiles.length === 0 ? <p className="text-gray-400">Nessun profilo trovato.</p> : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.filter((p) => !blocked.includes(p.id) && !deleted.includes(p.id)).map((profile) => (
        <div key={profile.id} className="bg-[#1f2a48] p-6 rounded-xl">
          <h4 className="text-lg font-semibold">{profile.nickname}</h4>
          <p className="text-sm text-gray-300">{profile.role} - {profile.category}</p>
          <p className="text-sm text-gray-400">{profile.city}, {profile.cap}</p>
          <p className="text-sm mt-2 text-gray-300">{profile.description}</p>
          <a href={`/chat?to=${profile.id}`} className="text-yellow-400 mt-3 inline-block">Contatta</a>
        </div>
      ))}
    </div>
  )}

  {/* Contatti cancellati */}
  <h3 className="text-xl font-bold mt-10 mb-4">Contatti eliminati</h3>
  {profiles.filter((p) => deleted.includes(p.id)).length === 0 ? <p className="text-gray-400">Nessuno.</p> : (
    <ul className="list-disc ml-6 text-gray-400">
      {profiles.filter((p) => deleted.includes(p.id)).map((p) => <li key={p.id}>{p.nickname}</li>)}
    </ul>
  )}

  {/* Accesso ai messaggi */}
  <div className="mt-12">
    <h3 className="text-xl font-bold mb-2">Messaggi</h3>
    <a href="/chat" className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold">Vai alla chat</a>
  </div>

  {/* Placeholder abbonamenti */}
  <div className="mt-12">
    <h3 className="text-xl font-bold mb-2">Abbonamento</h3>
    <p className="text-sm text-gray-300">Funzionalità di abbonamento in arrivo per i Professionisti dopo il periodo di prova.</p>
  </div>
</div>

); }

