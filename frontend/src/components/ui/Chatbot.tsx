import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import api from '../../api/axios';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hi there! I am the Vicharanashala AI Assistant. How can I help you with your internship queries today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.answer }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops! I encountered an error connecting to the knowledge base. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-brand-white border border-border-primary shadow-card-inner rounded-[1.5rem] w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-brand-aqua text-brand-white p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-medium tracking-tight">V-FAQ Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:scale-95 transition-transform">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-bg-secondary flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-bg-tertiary text-brand-white rounded-br-sm shadow-sm' : 'bg-brand-white border border-border-primary text-text-primary rounded-bl-sm shadow-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-brand-white border border-border-primary p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-aqua rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-brand-aqua rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-brand-aqua rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-brand-white border-t border-border-primary flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1 bg-bg-secondary border border-border-primary rounded-pill px-4 py-2 text-sm focus:outline-none focus:border-brand-aqua transition-colors"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-brand-aqua text-brand-white p-2 rounded-full hover:scale-95 transition-transform disabled:opacity-50 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group animate-fade-up flex items-center justify-end">
          {/* Hover Tooltip */}
          <div className="absolute right-[calc(100%+1rem)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 flex items-center">
            <div className="bg-bg-tertiary text-text-white text-sm font-medium px-4 py-3 rounded-2xl rounded-br-sm shadow-card-inner whitespace-nowrap border border-brand-black-light">
              Chat with V-FAQ Assistant to clarify your doubts!
            </div>
            {/* Little triangle pointing to the button */}
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[10px] border-l-bg-tertiary border-b-8 border-b-transparent"></div>
          </div>
          
          {/* Animated Button */}
          <button 
            onClick={() => setIsOpen(true)}
            className="relative bg-brand-aqua text-brand-white p-4 rounded-full shadow-card-inner hover:scale-110 transition-transform duration-300 z-10 group"
          >
            {/* Ping Animation Ring */}
            <div className="absolute inset-0 rounded-full bg-brand-aqua opacity-40 animate-ping"></div>
            <Bot className="w-7 h-7 relative z-10" />
          </button>
        </div>
      )}

    </div>
  );
};

export default Chatbot;
