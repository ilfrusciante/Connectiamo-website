// pages/chat.js
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

  // Finti contatti per sviluppo
  const fakeContacts = [
    {
      id: 'f1',
      nickname: 'Luca23',
      last_seen: new Date(Date.now() - 30 * 1000).toISOString(), // online
    },
    {
      id: 'f2',
      nickname: 'Anna_Design',
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // offline
    },
    {
      id: 'f3',
      nickname: 'Marco.Tech',
      last_seen: new Date(Date.now() - 20 * 1000).toISOString(), // online
    },
  ];

  // Messaggi finti tra user e Luca23
  const fakeMessages = [
    {
      id: 1,
      sender_id: 'me',
      receiver_id: 'f1',
      content: 'Ciao Luca, ti occupi anche di piccoli lavori?',
    },
    {
      id: 2,
      sender_id: 'f1',
      receiver_id: 'me',
      content: 'Certo! Di cosa hai bisogno?',
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
    else setConversations(fakeContacts); // fallback per sviluppo
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) fetchMessages();
    else if (selectedUser?.id === 'f1') setMessages(fakeMessages); // finti
    else setMessages([]);
  }, [selectedUser]);

  const fetchConversations = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id,
    });
    if (!error && data.length > 0) setConversations(data);
    else setConversations(fakeContacts); // fallback se vuoto
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

    if (selectedUser.id.startsWith('f')) {
      setMessages([...messages, { id: Date.now(), sender_id: 'me', receiver_id: selectedUser.id, content: newMessage }]);
      setNewMessage('');
      return;
    }

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

  const isOnline = (lastSeen) => {
    if (!lastSeen) return false;
    const secondsAgo = (Date.now() - new Date(lastSeen).getTime()) / 1000;
    return secondsAgo < 60;
  };

  return (
    <div className="flex h-screen text-white bg-[#0f1e3c]">
      {/* Contatti */}
      <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Messaggi</h2>
        {conversations.map((profile) => (
          <div
            key={profile.id}
            onClick={() => setSelectedUser(profile)}
            className={`p-2 cursor-pointer rounded mb-2 flex items-center gap-2 ${
              selectedUser?.id === profile.id
                ? 'bg-yellow-600 text-black'
                : 'hover:bg-gray-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline(profile.last_seen) ? 'bg-green-500' : 'bg-gray-500'
              }`}
            ></span>
            {profile.nickname}
          </div>
        ))}
      </div>

      {/* Messaggi */}
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
                      msg.sender_id === 'me' || msg.sender_id === user?.id
                        ? 'bg-yellow-500 text-black ml-auto'
                        : 'bg-gray-700'
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
  );
}
