// pages/chat.js import { useEffect, useState } from 'react'; import { supabase } from '../utils/supabaseClient'; import { useRouter } from 'next/router';

export default function ChatPage() { const router = useRouter(); const [user, setUser] = useState(null); const [messages, setMessages] = useState([]); const [newMessage, setNewMessage] = useState(''); const [conversations, setConversations] = useState([]); const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => { const fetchUser = async () => { const { data: { user }, } = await supabase.auth.getUser(); setUser(user); }; fetchUser(); }, []);

useEffect(() => { if (user) fetchConversations(); }, [user]);

useEffect(() => { if (user && selectedUser) fetchMessages(); }, [selectedUser]);

const fetchConversations = async () => { const { data, error } = await supabase.rpc('get_conversations', { current_user_id: user.id, }); if (!error) setConversations(data); };

const fetchMessages = async () => { const { data, error } = await supabase .from('messages') .select('*') .or(sender_id.eq.${user.id},receiver_id.eq.${user.id}) .order('created_at', { ascending: true });

if (!error) {
  const filtered = data.filter(
    (msg) =>
      (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
      (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)
  );
  setMessages(filtered);
}

};

const sendMessage = async () => { if (!newMessage.trim()) return; const { error } = await supabase.from('messages').insert({ sender_id: user.id, receiver_id: selectedUser.id, content: newMessage, }); if (!error) { setNewMessage(''); fetchMessages(); } };

if (!user) return <div className="p-4 text-white">Caricamento...</div>;

return ( <div className="flex h-screen text-white bg-[#0f1e3c]"> {/* Sidebar conversazioni */} <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto"> <h2 className="text-xl font-semibold mb-4">Messaggi</h2> {conversations.length === 0 && <p className="text-gray-400">Nessuna conversazione.</p>} {conversations.map((profile) => ( <div key={profile.id} onClick={() => setSelectedUser(profile)} className={p-2 cursor-pointer rounded mb-2 ${ selectedUser?.id === profile.id ? 'bg-yellow-600 text-black' : 'hover:bg-gray-700' }} > {profile.nickname} </div> ))} </div>

{/* Chat principale */}
  <div className="flex-1 flex flex-col p-4">
    {!selectedUser ? (
      <p className="text-gray-400">Seleziona un contatto per iniziare la conversazione.</p>
    ) : (
      <>
        <div className="flex-1 overflow-y-auto mb-4 border rounded bg-gray-800 p-3">
          {messages.length === 0 ? (
            <p className="text-gray-400">Nessun messaggio.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded max-w-xs ${
                  msg.sender_id === user.id ? 'bg-yellow-500 text-black ml-auto' : 'bg-gray-700'
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 rounded"
          >
            Invia
          </button>
        </div>
      </>
    )}
  </div>
</div>

); }

