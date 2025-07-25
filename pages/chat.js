import { useEffect, useState, useRef } from 'react';
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
  const messagesEndRef = useRef(null);

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

  // Polling ogni 3 secondi per aggiornare i messaggi della chat
  useEffect(() => {
    if (!user || !selectedUser) return;
    const interval = setInterval(() => {
      fetchMessages();
      // Dopo aver aggiornato i messaggi, segna come letti quelli ricevuti
      markMessagesAsRead(selectedUser.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [user, selectedUser]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatChannel = supabase
      .channel(`chat-realtime-${user.id}-${selectedUser.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or=(receiver_id.eq.${user.id},sender_id.eq.${user.id})`
      }, (payload) => {
        const msg = payload.new;
        if (
          (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
          (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)
        ) {
          fetchMessages();
        }
        // Aggiorna sempre la lista contatti
        fetchContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [user, selectedUser]);

  // Scroll automatico in fondo dopo ogni aggiornamento dei messaggi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    console.log('Segno come letti i messaggi ricevuti da', senderId, 'per l\'utente', user?.id);
    console.log('user.id:', user?.id, typeof user?.id);
    console.log('senderId:', senderId, typeof senderId);
    const { error, data } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('receiver_id', user.id)
      .eq('sender_id', senderId)
      .is('read_at', null)
      .select();
    console.log('Risultato update:', { error, data });
    // Notifica la Navbar di aggiornare il badge dopo un piccolo delay
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('update-unread-badge'));
      }, 200);
    }
  };

  // Quando arriva un nuovo messaggio tramite polling, segna come letti
  useEffect(() => {
    if (!user || !selectedUser) return;
    if (messages.length > 0) {
      markMessagesAsRead(selectedUser.id);
    }
  }, [messages, user, selectedUser]);

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white p-4">
      <div className="flex justify-end items-center mb-6">
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
            {selectedUser?.avatar ? (
              <img
                src={selectedUser.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                style={{ minWidth: 48, minHeight: 48 }}
              />
            ) : (
              <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                  <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                </svg>
              </span>
            )}
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
                      selectedUser?.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 mr-2"
                          style={{ minWidth: 32, minHeight: 32 }}
                        />
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-white dark:bg-gray-900 mr-2">
                          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="16" r="8" fill="#e5e7eb" />
                            <ellipse cx="24" cy="36" rx="14" ry="8" fill="#e5e7eb" />
                          </svg>
                        </span>
                      )
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
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
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
