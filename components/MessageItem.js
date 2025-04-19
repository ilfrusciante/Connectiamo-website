export default function MessageItem({ message, isSent }) {
  return (
    <div className={\`\${isSent ? 'justify-end' : 'justify-start'} flex mb-3\`}>
      <div
        className={\`
          max-w-xs px-4 py-2 rounded-lg shadow
          \${isSent
            ? 'bg-yellow-400 text-black self-end'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}
        \`}
      >
        <p className="text-sm mb-1">{message?.text}</p>
        <span className="text-xs text-gray-600 dark:text-gray-300 block text-right">
          {new Date(message?.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
