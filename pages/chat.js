// pages/chat.js
import { useState } from 'react';

const fakeUsers = [
  { id: '1', nickname: 'Luca' },
  { id: '2', nickname: 'Martina' },
  { id: '3', nickname: 'Davide' },
];

const fakeMessages = {
  '1': [
    { id: 1, sender: 'me', content: 'Ciao Luca!' },
    { id: 2, sender: '1', content: 'Ciao! Come va?' },
  ],
  '2': [
    { id: 1, sender: 'me', content: 'Ciao Martina!' },
    { id: 2, sender: '2', content: 'Ehi, tutto bene grazie!' },
  ],
  '3': [],
};

export default function ChatMock() {
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const openChat = (user) => {
    setSelected(user);
    setMessages(fakeMessages[user.id] || []);
  };

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const updated = [...messages, { id: Date.now(), sender: 'me', content: newMsg }];
    setMessages(updated);
    setNewMsg('');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0f1e3c] text-white">
      {/* Lista contatti */}
      <div className="md:w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Contatti</h2>
        {fakeUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => openChat(user)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selected?.id === user.id ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'
            }`}
          >
            {user.nickname}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col p-4">
        {selected ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Chat con {selected.nickname}</h3>
            <div className="flex-1 bg-gray-800 rounded p-3 overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <p className="text-gray-400">Nessun messaggio.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mb-2 p-2 rounded max-w-xs ${
                      m.sender === 'me'
                        ? 'bg-yellow-500 text-black ml-auto'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Scrivi un messaggio..."
              />
              <button
                onClick={handleSend}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 rounded"
              >
                Invia
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Seleziona un contatto per iniziare la conversazione.</p>
        )}
      </div>
    </div>
  );
}
