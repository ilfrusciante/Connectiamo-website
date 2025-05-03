import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Chat() {
  const router = useRouter();
  const { to } = router.query; // ID dell'utente destinatario (receiver_id)
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Recupera l'utente autenticato
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Errore autenticazione:', error);
        return;
      }
      setUser(data.user);
    };
    getCurrentUser();
  }, []);

  // Carica i messaggi una volta che l'utente e il destinatario sono disponibili
  useEffect(() => {
    if (user && to) {
      fetchMessages();
    }
  }, [user, to]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${to}),and(sender_id.eq.${to},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Errore nel recupero dei messaggi:', error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: user.id,
        receiver_id: to,
        content: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error('Errore invio messaggio:', error);
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="bg-gray-800 rounded p-4 h-96 overflow-y-scroll mb-4">
        {loading ? (
          <p>Caricamento...</p>
        ) : messages.length === 0 ? (
          <p>Nessun messaggio.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.sender_id === user.id ? 'text-right' : 'text-left'
              }`}
            >
              <div className="inline-block bg-gray-700 px-3 py-2 rounded">
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-grow px-3 py-2 rounded bg-gray-700 text-white outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600"
        >
          Invia
        </button>
      </div>
    </div>
  );
}
