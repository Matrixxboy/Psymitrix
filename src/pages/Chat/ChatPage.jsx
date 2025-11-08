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

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await aiChatAPI.getChatHistory(20);
        if (data?.messages) {
          setMessages(data.messages.map(msg => ({
            id: msg.message_id,
            sender: msg.sender,
            content: msg.message,
            timestamp: msg.timestamp
          })));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiChatAPI.sendMessage(input);
      const aiMessage = {
        id: response.message_id,
        sender: 'bot',
        content: response.ai_response,
        timestamp: response.timestamp,
        analysis: response.analysis
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        content: 'I encountered an issue processing your message. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        await aiChatAPI.clearChatHistory();
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-background to-light-secondary dark:from-dark-background dark:to-dark-secondary p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-8 h-8 text-light-accent dark:text-dark-accent animate-heartbeat" />
            <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">
              Your AI Psychiatrist
            </h1>
          </div>
          <p className="text-light-body dark:text-dark-body text-lg">
            A safe space to share your thoughts and feelings
          </p>
        </motion.div>

        {/* Chat Container */}
        <GlassCard className="h-[500px] md:h-[600px] flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-8 h-8 animate-spin text-light-primary dark:text-dark-primary" />
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <MessageSquare className="w-16 h-16 text-light-secondary dark:text-dark-secondary mb-4 opacity-50" />
                  <p className="text-light-body dark:text-dark-body text-lg">
                    Start a conversation whenever you're ready. I'm here to listen and support you.
                  </p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-light-accent dark:bg-dark-accent text-white rounded-br-none'
                          : 'bg-white/30 dark:bg-white/10 text-light-body dark:text-dark-body border border-white/20 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.analysis && message.analysis.severity_level === 'critical' && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-xs font-semibold text-red-300">⚠️ Crisis Support</p>
                          <p className="text-xs mt-1">If you're in crisis, please contact 988 (Suicide & Crisis Lifeline)</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 dark:bg-white/10" />

          {/* Input Area */}
          <div className="p-4 space-y-3">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-light-body dark:text-dark-body text-sm"
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </motion.div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 dark:bg-white/10 text-light-body dark:text-dark-body placeholder-light-body/50 dark:placeholder-dark-body/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="w-full text-xs text-light-body/60 dark:text-dark-body/60 hover:text-light-body dark:hover:text-dark-body transition-colors"
              >
                Clear conversation history
              </button>
            )}
          </div>
        </GlassCard>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg"
        >
          <p className="text-sm text-light-body dark:text-dark-body">
            <strong>💡 Tip:</strong> This AI assistant provides supportive guidance based on evidence-based mental health practices. For serious mental health concerns, please reach out to a licensed professional.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
