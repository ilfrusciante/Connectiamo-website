import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) fetchMessages();
  }, [selectedUser]);

  const fetchConversations = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id,
    });
    if (!error) setConversations(data);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (!error) {
      const filtered = data.filter(
        (msg) =>
          (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
          (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)
      );
      setMessages(filtered);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: newMessage,
    });
    if (!error) {
      setNewMessage('');
      fetchMessages();
    }
  };

  if (!user) return <div className="p-4 text-white">Caricamento...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen text-white bg-[#0f1e3c]">
      {/* Contatti */}
      <div className={`md:w-1/3 w-full ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-700 bg-[#0f1e3c]">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Contatti</h2>
          {conversations.length === 0 ? (
            <p className="text-gray-400 italic">Nessuna conversazione.</p>
          ) : (
            conversations.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setSelectedUser(profile)}
                className={`p-3 mb-2 rounded cursor-pointer transition ${
                  selectedUser?.id === profile.id
                    ? 'bg-yellow-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {profile.nickname}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat */}
      <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser && (
          <>
            <div className="p-3 flex justify-between items-center bg-[#112244] border-b border-gray-700">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-yellow-400 hover:underline text-sm"
              >
                ← Torna ai contatti
              </button>
              <div className="font-bold">{selectedUser.nickname}</div>
              <div></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1a2b4c]">
              {messages.length === 0 ? (
                <p className="text-gray-400">Nessun messaggio.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] p-3 rounded-xl text-sm shadow ${
                      msg.sender_id === user.id
                        ? 'bg-yellow-400 text-black ml-auto'
                        : 'bg-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex gap-2 bg-[#0f1e3c]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
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
  );
}
