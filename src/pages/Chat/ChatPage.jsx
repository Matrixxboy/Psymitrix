import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Heart, MessageSquare } from 'lucide-react';
import { aiChatAPI } from '../../api/ai_chat';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // 🧠 Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await aiChatAPI.getChatHistory(20);
        if (data?.messages) {
          setMessages(
            data.messages.map((msg) => ({
              id: msg.message_id,
              sender: msg.sender,
              content: msg.message,
              timestamp: msg.timestamp,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  // 🧭 Track scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsUserAtBottom(scrollHeight - scrollTop - clientHeight < 40);
    };
    const container = messagesContainerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // 🧩 Scroll only if user at bottom
  useEffect(() => {
    if (isUserAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserAtBottom]);

  // 💬 Handle send
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiChatAPI.sendMessage(input);
      const aiMessage = {
        id: response.message_id,
        sender: 'Shvayam',
        content: response.ai_response,
        timestamp: response.timestamp,
        analysis: response.analysis,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          content: '⚠️ Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Clear chat history?')) {
      try {
        await aiChatAPI.clearChatHistory();
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-b pt-[90px] px-3 py-6 md:px-8">
      {/* 🩵 Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-7 h-7 text-light-accent dark:text-dark-accent animate-pulse" />
          <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">
            Shvayam Your AI Psychiatrist
          </h1>
        </div>
        <p className="text-light-body dark:text-dark-body text-base">
          A safe space to share your thoughts and feelings
        </p>
      </motion.div>

      {/* 💬 Chat Container */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        <GlassCard className="flex flex-col h-[500px] md:h-[550px] rounded-2xl shadow-xl overflow-hidden">
          {/* Messages Section */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scroll-smooth"
          >
            <AnimatePresence>
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-8 h-8 animate-spin text-light-accent dark:text-dark-accent" />
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-3"
                >
                  <MessageSquare className="w-12 h-12 text-light-secondary dark:text-dark-secondary opacity-60" />
                  <p className="text-light-body dark:text-dark-body text-base md:text-lg max-w-sm">
                    Start chatting when you’re ready — I’m here to listen.
                  </p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-light-accent dark:bg-dark-accent text-white rounded-br-none'
                          : 'bg-white/30 dark:bg-white/10 text-light-body dark:text-dark-body border border-white/20 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                      {message.analysis?.severity_level === 'critical' && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-xs font-semibold text-red-400">⚠️ Crisis Support</p>
                          <p className="text-xs mt-1">
                            If you’re in crisis, please contact 988 (Suicide & Crisis Lifeline)
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Bottom Input */}
          <div className="p-3 sm:p-4 bg-white/10 dark:bg-white/5 border-t border-white/20">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-light-body dark:text-dark-body mb-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 dark:bg-white/10 text-light-body dark:text-dark-body placeholder-light-body/50 dark:placeholder-dark-body/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent disabled:opacity-50 text-sm md:text-base"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="w-full mt-2 text-xs text-light-body/60 dark:text-dark-body/60 hover:text-light-body dark:hover:text-dark-body transition"
              >
                Clear conversation history
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ChatPage;
