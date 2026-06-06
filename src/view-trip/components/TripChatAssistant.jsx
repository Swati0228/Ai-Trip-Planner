import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function TripChatAssistant({ trip }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi! 👋 I'm your AI travel assistant for your trip to ${trip?.userSelection?.location?.label || 'your destination'}. Ask me anything about your trip!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const tripContext = `
        You are a helpful travel assistant. The user is traveling to ${trip?.userSelection?.location?.label},
        for ${trip?.userSelection?.noOfDays} days,
        with a ${trip?.userSelection?.budget} budget,
        traveling as ${trip?.userSelection?.traveler}.
        Answer questions about this trip concisely and helpfully.
      `;

      const result = await model.generateContent(`${tripContext}\n\nUser question: ${input}`);
      const response = result.response.text();

      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I encountered an error. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    '🎒 What should I pack?',
    '🍽️ Best local foods to try?',
    '🚗 Best way to get around?',
    '💡 Any safety tips?',
  ];

  return (
    <div className="mt-10 mb-10">
      {/* Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200"
      >
        <span className="text-xl">🤖</span>
        <span className="text-lg">Ask AI Travel Assistant</span>
        <span className="ml-auto text-xl">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="mt-3 border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 bg-white">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.replace(/^.{2}\s/, ''))}
                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1 rounded-full transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your trip..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripChatAssistant;