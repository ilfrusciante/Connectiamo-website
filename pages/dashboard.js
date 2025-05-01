// pages/dashboard.js import { useEffect, useState } from 'react'; import { useRouter } from 'next/router'; import { supabase } from '../utils/supabaseClient'; import { useSession } from '@supabase/auth-helpers-react';

export default function Dashboard() { const router = useRouter(); const session = useSession();

const [profiles, setProfiles] = useState([]); const [selectedUser, setSelectedUser] = useState(null); const [messages, setMessages] = useState([]); const [newMessage, setNewMessage] = useState('');

useEffect(() => { if (!session) { router.push('/login'); } else { fetchProfiles(); } }, [session]);

async function fetchProfiles() { const { data, error } = await supabase.from('profiles').select('*'); if (!error) setProfiles(data); }

async function fetchMessages(userId) { setSelectedUser(userId); const { data, error } = await supabase .from('messages') .select('*') .or(sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}) .order('created_at');

if (!error) setMessages(data.filter(
  msg => (msg.sender_id === session.user.id && msg.recipient_id === userId) ||
          (msg.sender_id === userId && msg.recipient_id === session.user.id)
));

}

async function sendMessage() { if (!newMessage.trim()) return;

const { error } = await supabase.from('messages').insert({
  sender_id: session.user.id,
  recipient_id: selectedUser,
  content: newMessage
});

if (!error) {
  setNewMessage('');
  fetchMessages(selectedUser);
}

}

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">Dashboard</h1> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <h2 className="text-xl font-semibold mb-2">Contatti</h2> <ul className="space-y-2"> {profiles.filter(p => p.id !== session?.user.id).map(profile => ( <li key={profile.id}> <button onClick={() => fetchMessages(profile.id)} className="text-blue-600 hover:underline" > {profile.name || profile.email} </button> </li> ))} </ul> </div>

<div>
      <h2 className="text-xl font-semibold mb-2">Messaggi</h2>
      {selectedUser ? (
        <div>
          <div className="h-64 overflow-y-scroll border p-2 bg-white rounded mb-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-1 ${msg.sender_id === session.user.id ? 'text-right' : 'text-left'}`}
              >
                <span className="inline-block px-2 py-1 bg-gray-200 rounded">
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Scrivi un messaggio"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Invia
            </button>
          </div>
        </div>
      ) : (
        <p>Seleziona un contatto per iniziare la conversazione.</p>
      )}
    </div>
  </div>
</div>

); }

