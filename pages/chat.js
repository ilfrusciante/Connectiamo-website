import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import dayjs from 'dayjs';

export default function ChatPage() {
  const router = useRouter();
  const { to } = router.query;

  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0 && to) {
      const found = contacts.find((c) => c.id === to);
      if (found) setSelectedUser(found);
    }
  }, [contacts, to]);

  useEffect(() => {
    if (user && selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .rpc('get_conversations', { current_user_id: user.id });

    if (!error) setContacts(data || []);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (!error && data) {
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

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white p-4">
      <h1 className="text-center text-2xl font-semibold mb-6">Chat privata</h1>

      {!selectedUser ? (
        <p className="text-center text-gray-400">Seleziona un contatto per iniziare a chattare.</p>
      ) : (
        <>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-semibold">{selectedUser.nickname || 'Utente'}</p>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">Nessun messaggio</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                    msg.sender_id === user.id
                      ? 'bg-yellow-400 text-black ml-auto'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-[0.7rem] text-right text-gray-500 mt-1">
                    {dayjs(msg.created_at).format('HH:mm')}
                  </p>
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
              className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full"
            >
              Invia
            </button>
          </div>
        </>
      )}
    </div>
  );
}
