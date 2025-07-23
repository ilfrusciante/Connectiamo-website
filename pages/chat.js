import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import dayjs from 'dayjs';
import Link from 'next/link';

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
    if (user) fetchContacts();
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0 && to) {
      const found = contacts.find((c) => c.id === to);
      if (found) {
        setSelectedUser(found);
        markMessagesAsRead(found.id);
      }
    }
  }, [contacts, to]);

  useEffect(() => {
    if (user && selectedUser) fetchMessages();
  }, [selectedUser]);

  const fetchContacts = async () => {
    const { data, error } = await supabase.rpc('get_conversations', {
      current_user_id: user.id
    });
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

  const markMessagesAsRead = async (senderId) => {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', senderId)
      .eq('read', false);
  };

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white p-4">
      {/* HEADER NAV */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <span className="text-xl font-bold text-white cursor-pointer hover:text-yellow-400">Connectiamo</span>
        </Link>
        <Link href="/messages">
          <button className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-full transition">
            Torna ai contatti
          </button>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-semibold mb-4">Chat privata</h1>

      {!selectedUser ? (
        <p className="text-center text-gray-400">Seleziona un contatto per iniziare a chattare.</p>
      ) : (
        <>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 flex items-center gap-3">
            <img
              src={selectedUser?.avatar || '/images/default-avatar.png'}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
              style={{ minWidth: 48, minHeight: 48 }}
            />
            <p className="font-semibold">{selectedUser.nickname || 'Utente'}</p>
          </div>

          <div className="bg-white text-black p-4 rounded-lg mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">Nessun messaggio</p>
            ) : (
              messages.map((msg) => {
                const isSent = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex mb-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    {!isSent && (
                      <img
                        src={selectedUser?.avatar || '/images/default-avatar.png'}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 mr-2"
                        style={{ minWidth: 32, minHeight: 32 }}
                      />
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                        isSent
                          ? 'bg-[#ffe066] bg-opacity-70 text-black ml-auto'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-[0.7rem] text-right text-gray-600 mt-1">
                        {dayjs(msg.created_at).format('HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })
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
              disabled={!newMessage.trim()}
              className={`font-semibold px-5 py-2 rounded-full transition ${
                newMessage.trim()
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                  : 'bg-gray-400 cursor-not-allowed text-white'
              }`}
            >
              Invia
            </button>
          </div>
        </>
      )}
    </div>
  );
}
