'use client';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (currentMessage) {
      setChatHistory((prev) => [...prev, currentMessage]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="h-screen w-screen text-black">
      {/* Blue header bar */}
      <div className="bg-blue-500 text-white p-4 text-xl font-semibold">
        Interview
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Chat Window */}
        <div className="w-1/2 h-full p-4 border-r border-gray-300">
          {/* Chat History */}
          <div className="flex flex-col h-4/5 overflow-y-scroll border-b border-gray-200 mb-4">
            {chatHistory.length === 0 ? (
              <div className="my-2 p-2 text-center text-white">
                Welcome to your mock interview! Send a message to get started!
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div key={index} className="my-2 p-2 bg-blue-200 rounded-md">
                  {message}
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex">
            <input
              type="text"
              placeholder="Write message"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="p-2 flex-1 border rounded-md"
              onKeyPress={(e) => (e.key === 'Enter' ? handleSendMessage() : null)}
            />
            <button onClick={handleSendMessage} className="ml-2 text-white">
              <i className="fas fa-paper-plane text-xl"></i>
            </button>
          </div>
        </div>

        {/* Code Window */}
        <div className="w-1/2 h-full p-4">
          <textarea
            placeholder="Enter code here"
            className="w-full h-full p-4 border rounded-md resize-none"
          />
        </div>
      </div>
    </div>
  );
}
