import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fakeContacts = [
    { id: 'f1', nickname: 'Luca23', last_seen: new Date(Date.now() - 30 * 1000).toISOString() },
    { id: 'f2', nickname: 'Anna_Design', last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'f3', nickname: 'Marco.Tech', last_seen: new Date(Date.now() - 20 * 1000).toISOString() },
  ];

  const fakeMessages = [
    { id: 1, sender_id: 'me', receiver_id: 'f1', content: 'Ciao Luca, ti occupi anche di piccoli lavori?' },
    { id: 2, sender_id: 'f1', receiver_id: 'me', content: 'Certo! Di cosa hai bisogno?' },
    { id: 3, sender_id: 'me', receiver_id: 'f1', content: 'Una parete da imbiancare. Ti va?' },
    { id: 4, sender_id: 'f1', receiver_id: 'me', content: 'Perfetto, ci organizziamo!' },
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
    else setConversations(fakeContacts);
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) fetchMessages();
    else if (selectedUser?.id === 'f1') setMessages(fakeMessages);
    else setMessages([]);
  }, [selectedUser]);

  const fetchConversations = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user?.id,
    });
    if (!error && data.length > 0) setConversations(data);
    else setConversations(fakeContacts);
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
      setMessages([...messages, {
        id: Date.now(),
        sender_id: 'me',
        receiver_id: selectedUser.id,
        content: newMessage
      }]);
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
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-800 p-4 overflow-y-auto hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Messaggi</h2>
        {conversations.map((profile) => (
          <div
            key={profile.id}
            onClick={() => setSelectedUser(profile)}
            className={`p-3 cursor-pointer rounded mb-2 flex items-center gap-3 transition ${
              selectedUser?.id === profile.id
                ? 'bg-yellow-600 text-black'
                : 'hover:bg-gray-700'
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                isOnline(profile.last_seen) ? 'bg-green-400' : 'bg-gray-500'
              }`}
            ></span>
            <span className="font-medium">{profile.nickname}</span>
          </div>
        ))}
      </div>

      {/* Chat principale */}
      <div className="flex-1 flex flex-col p-4">
        {!selectedUser ? (
          <p className="text-gray-400">Seleziona un contatto per iniziare la conversazione.</p>
        ) : (
          <>
            {/* Header contatto */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-md mb-2 shadow">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${
                  isOnline(selectedUser.last_seen) ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <div>
                  <p className="font-semibold text-white">{selectedUser.nickname}</p>
                  <p className="text-xs text-gray-400">
                    {isOnline(selectedUser.last_seen) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista messaggi */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2 px-2 py-1 bg-gray-900 rounded-md">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                    msg.sender_id === 'me' || msg.sender_id === user?.id
                      ? 'bg-yellow-400 text-black ml-auto'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input messaggio */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-300 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full transition"
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
