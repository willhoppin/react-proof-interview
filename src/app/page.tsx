'use client';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const insults = [
      "Are you sure about that??",
      "Your code looks weak as hell... why did you do that?",
      "Seriously? My grandma codes better than that.",
      "Did you learn coding from a cereal box?"
    ];

    const timer = setInterval(() => {
      const randomInsult = insults[Math.floor(Math.random() * insults.length)];
      setChatHistory((prev) => [...prev, randomInsult]);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

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
                <div key={index} className={`my-2 p-2 rounded-md ${index % 2 === 0 ? 'bg-white text-black' : 'bg-blue-200 text-white'}`}>
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
          {/* Instructions Box */}
          <div className="p-4 mb-4 border rounded-md bg-gray-100 mb-200">
            Write a function to solve the TwoSum problem. Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.
          </div>

          {/* Code Textarea */}
          <textarea
            placeholder="Enter your solution here..."
            className="w-full h-4/5 p-4 border rounded-md font-mono" // font-mono represents Courier New font.
          />
        </div>
      </div>
    </div>
  );
}
