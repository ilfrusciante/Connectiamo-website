export default function MessageItem({ message, isSent }) {
  return (
    <div className={`${isSent ? 'justify-end' : 'justify-start'} flex mb-3`}>
      <div
        className={`
          max-w-xs px-4 py-2 rounded-lg shadow
          ${isSent ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'}
          dark:${isSent ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-white'}
        `}
      >
        <p>{message.text}</p>
        <p className="text-xs mt-1 text-right">{message.timestamp}</p>
      </div>
    </div>
  );
}

