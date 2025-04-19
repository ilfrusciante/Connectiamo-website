import MessageItem from './MessageItem';

export default function MessageList({ messages, currentUserId }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
      {messages && messages.length > 0 ? (
        messages.map((msg, idx) => (
          <MessageItem
            key={idx}
            message={msg}
            isSent={msg.senderId === currentUserId}
          />
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">Nessun messaggio</p>
      )}
    </div>
  );
}
