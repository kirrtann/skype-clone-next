import React from 'react';

interface MessageBubbleProps {
  message: string;
  sender: boolean;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender, timestamp }) => {
  return (
    <div className={`flex mb-4 ${sender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          sender
            ? 'bg-[#0078d4] text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow'
        }`}
      >
        <p className="text-sm">{message}</p>
        {timestamp && (
          <span className="text-xs mt-1 block opacity-70">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
