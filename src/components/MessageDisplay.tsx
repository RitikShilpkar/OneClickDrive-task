"use client";
import { useMessages } from '../context/MessageContext';

export default function MessageDisplay() {
  const { messages, removeMessage } = useMessages();

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : message.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{message.text}</span>
            <button
              onClick={() => removeMessage(message.id)}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 