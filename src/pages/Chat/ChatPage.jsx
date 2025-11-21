import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Heart, MessageSquare, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { aiChatAPI } from '../../api/ai_chat';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

const CRISIS_KEYWORDS = [
  'suicide', 'harm', 'kill myself', 'hurt myself', 'end it all', 'overdose',
  'cut myself', 'self-harm', 'no point living', 'better off dead', 'give up',
];

const SUGGESTED_STARTERS = [
  "How have you been feeling lately?",
  "Tell me about your day",
  "What's been on your mind?",
  "I'd like to discuss my stress",
  "Help me understand my emotions",
];

const detectSentiment = (text) => {
  const lower = text.toLowerCase();

  if (CRISIS_KEYWORDS.some(keyword => lower.includes(keyword))) return "critical";

  const negativeWords = ['depressed', 'anxious', 'worried', 'stressed', 'scared', 'afraid', 'overwhelmed', 'hopeless'];
  const positiveWords = ['happy', 'great', 'good', 'excited', 'grateful', 'proud', 'confident'];

  const negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;

  if (negativeCount > positiveCount) return "negative";
  if (positiveCount > negativeCount) return "positive";
  return "neutral";
};

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'critical': return 'text-red-500';
    case 'negative': return 'text-amber-500';
    case 'positive': return 'text-green-500';
    default: return 'text-light-primary dark:text-dark-primary';
  }
};

const getSentimentLabel = (sentiment) => {
  switch (sentiment) {
    case 'critical': return 'Crisis Alert';
    case 'negative': return 'Challenging feelings';
    case 'positive': return 'Positive mood';
    default: return 'Neutral';
  }
};

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [messageSentiment, setMessageSentiment] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Smooth internal-only scroll
  const scrollToBottom = (behavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  // Load chat history
  useEffect(() => {
    const load = async () => {
      try {
        const data = await aiChatAPI.getChatHistory(20);
        if (data?.messages) {
          setMessages(data.messages.map(msg => ({
            id: msg.message_id,
            sender: msg.sender,
            content: msg.message,
            timestamp: msg.timestamp,
            analysis: msg.analysis,
          })));
        }
      } catch (e) {
        console.error('History load failed:', e);
      } finally {
        setLoadingHistory(false);
        setTimeout(() => scrollToBottom('auto'), 50);
      }
    };
    load();
  }, []);

  // Real-time sentiment preview
  useEffect(() => {
    setMessageSentiment(input.trim() ? detectSentiment(input) : null);
  }, [input]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const sentiment = detectSentiment(input);
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
      sentiment,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Scroll after rendering user message
    setTimeout(() => scrollToBottom(), 20);

    setLoading(true);

    try {
      const response = await aiChatAPI.sendMessage(input);
      const aiMessage = {
        id: response.message_id,
        sender: "Shvayam",
        content: response.ai_response,
        timestamp: response.timestamp,
        analysis: response.analysis,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Scroll for AI messages too (OPTION B)
      setTimeout(() => scrollToBottom(), 20);

    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear conversation? This cannot be undone.")) return;

    try {
      await aiChatAPI.clearChatHistory();
      setMessages([]);
    } catch (e) {
      console.error("Failed to clear:", e);
    }
  };

  const latestMood = user?.mood_trends?.[0]?.mood || 'not tracked';

  return (
    <div className="flex flex-col bg-gradient-to-b mt-[50px] px-3 py-6 md:px-8 min-h-screen">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-7 h-7 text-light-primary dark:text-dark-primary animate-pulse" />
          <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">
            Shvayam
          </h1>
        </div>
        <p className="text-light-body dark:text-dark-body text-base">
          Your compassionate AI psychiatrist
        </p>
      </motion.div>

      {/* User context */}
      {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl mx-auto mb-4">
          <div className="flex gap-3 flex-wrap justify-center">
            <div className="px-3 py-1.5 bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full text-xs flex gap-1">
              <span className="font-semibold">Mood:</span> {latestMood}
            </div>
            <div className="px-3 py-1.5 bg-light-accent/20 dark:bg-dark-accent/20 rounded-full text-xs flex gap-1">
              <span className="font-semibold">Streak:</span> {user.streak} days
            </div>
            <div className="px-3 py-1.5 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full text-xs flex gap-1">
              <span className="font-semibold">Sessions:</span> {user.sessions_chat_history.length}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main chat UI */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        <GlassCard className="flex flex-col h-[600px] md:h-[600px] rounded-2xl shadow-xl overflow-hidden">

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <AnimatePresence>
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6"
                >
                  <MessageSquare className="w-12 h-12 opacity-60" />

                  <div>
                    <p className="text-lg font-semibold mb-2">Welcome to your safe space</p>
                    <p className="text-sm text-light-body/70 dark:text-dark-body/70 max-w-sm">
                      I'm here to listen. You can start by choosing one of the common questions people ask.
                    </p>
                  </div>

                  {/* FAQ Section */}
                  <div className="w-full max-w-md space-y-3">
                    <h3 className="text-sm text-light-body/70 dark:text-dark-body/70 font-semibold text-left mb-2">
                      Frequently Asked Questions
                    </h3>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Why am I feeling so stressed lately?",
                        "How do I deal with overthinking?",
                        "Why do I feel lonely even around people?",
                        "How do I stay motivated?",
                        "Why do small things affect me so much?",
                        "How can I manage my anger better?",
                      ].map((faq, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(faq)}
                          className="px-4 py-2 text-left text-sm rounded-lg bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-body dark:text-dark-body hover:bg-light-secondary/30 dark:hover:bg-dark-secondary/30 transition-colors"
                        >
                          {faq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Starters Section */}
                  <div className="w-full max-w-md space-y-2">
                    <h3 className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold">
                      Conversation Starters
                    </h3>

                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_STARTERS.map((starter, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(starter)}
                          className="px-3 py-2 text-left text-sm rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          {starter}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${m.sender === 'user'
                        ? 'bg-light-primary dark:bg-dark-primary text-white rounded-br-none'
                        : 'bg-white/30 dark:bg-white/10 text-light-body dark:text-dark-body border border-white/20 rounded-bl-none'
                      }`}>
                      <p className="whitespace-pre-line text-sm">{m.content}</p>

                      {m.sentiment && m.sender === 'user' && (
                        <div className="text-xs mt-2 opacity-80">
                          {getSentimentLabel(m.sentiment)}
                        </div>
                      )}

                      {m.analysis?.insights && m.sender === 'Shvayam' && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Insight
                          </p>
                          <p className="text-xs">{m.analysis.insights}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/10 border-t border-white/20">

            {messageSentiment && input.trim() && (
              <div className={`flex items-center gap-2 text-xs mb-2 ${getSentimentColor(messageSentiment)}`}>
                <Lightbulb className="w-3 h-3" />
                {getSentimentLabel(messageSentiment)}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <Loader className="w-4 h-4 animate-spin" />
                Shvayam is thinking...
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/20 text-sm backdrop-blur"
              />
              <button
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="w-full mt-2 text-xs opacity-60 hover:opacity-100"
              >
                Clear conversation
              </button>
            )}

          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default ChatPage;
