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
  
  if (CRISIS_KEYWORDS.some(keyword => lower.includes(keyword))) {
    return 'critical';
  }
  
  const negativeWords = ['depressed', 'anxious', 'worried', 'stressed', 'scared', 'afraid', 'overwhelmed', 'hopeless'];
  const positiveWords = ['happy', 'great', 'good', 'excited', 'grateful', 'proud', 'confident', 'grateful'];
  
  const negativeCount = negativeWords.filter(word => lower.includes(word)).length;
  const positiveCount = positiveWords.filter(word => lower.includes(word)).length;
  
  if (negativeCount > positiveCount) {
    return 'negative';
  } else if (positiveCount > negativeCount) {
    return 'positive';
  }
  return 'neutral';
};

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'critical':
      return 'text-red-500';
    case 'negative':
      return 'text-amber-500';
    case 'positive':
      return 'text-green-500';
    default:
      return 'text-light-primary dark:text-dark-primary';
  }
};

const getSentimentLabel = (sentiment) => {
  switch (sentiment) {
    case 'critical':
      return 'Crisis Alert';
    case 'negative':
      return 'Challenging feelings';
    case 'positive':
      return 'Positive mood';
    default:
      return 'Neutral';
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
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Load chat history
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
              analysis: msg.analysis,
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

  // Track scroll
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

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isUserAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserAtBottom]);

  // Detect sentiment in real-time
  useEffect(() => {
    if (input.trim()) {
      setMessageSentiment(detectSentiment(input));
    } else {
      setMessageSentiment(null);
    }
  }, [input]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userSentiment = detectSentiment(input);
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      sentiment: userSentiment,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setMessageSentiment(null);
    setLoading(true);
    console.log("ChatPage: Sending message:", input);

    try {
      const response = await aiChatAPI.sendMessage(input);
      console.log("ChatPage: AI response received:", response);
      const aiMessage = {
        id: response.message_id,
        sender: 'Shvayam',
        content: response.ai_response,
        timestamp: response.timestamp,
        analysis: response.analysis,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('ChatPage: Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      try {
        await aiChatAPI.clearChatHistory();
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const handleSuggestedStarter = (starter) => {
    setInput(starter);
  };

  const latestMood = user?.mood_trends?.[0]?.mood || 'not tracked';

  return (
    <div className="flex flex-col bg-gradient-to-b mt-[90px] px-3 py-6 md:px-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-7 h-7 text-light-primary dark:text-dark-primary animate-pulse" />
          <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">
            Shvayam
          </h1>
        </div>
        <p className="text-light-body dark:text-dark-body text-base">
          Your compassionate AI psychiatrist - a safe space to share your thoughts and feelings
        </p>
      </motion.div>

      {/* User Context Bar */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl mx-auto mb-4"
        >
          <div className="flex gap-3 flex-wrap justify-center">
            <div className="px-3 py-1.5 bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full text-xs text-light-body dark:text-dark-body flex items-center gap-1">
              <span className="font-semibold">Current mood:</span>
              <span className="capitalize font-medium">{latestMood}</span>
            </div>
            <div className="px-3 py-1.5 bg-light-accent/20 dark:bg-dark-accent/20 rounded-full text-xs text-light-body dark:text-dark-body flex items-center gap-1">
              <span className="font-semibold">Streak:</span>
              <span>{user.streak} days</span>
            </div>
            <div className="px-3 py-1.5 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full text-xs text-light-body dark:text-dark-body flex items-center gap-1">
              <span className="font-semibold">Sessions:</span>
              <span>{user.sessions_chat_history.length}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Chat Container */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        <GlassCard className="flex flex-col h-[500px] md:h-[600px] rounded-2xl shadow-xl overflow-hidden">
          {/* Messages Section */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 scroll-smooth"
          >
            <AnimatePresence>
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-8 h-8 animate-spin text-light-primary dark:text-dark-primary" />
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6"
                >
                  <MessageSquare className="w-12 h-12 text-light-secondary dark:text-dark-secondary opacity-60" />
                  <div>
                    <p className="text-light-body dark:text-dark-body text-base md:text-lg max-w-sm font-semibold mb-4">
                      Welcome to our chat
                    </p>
                    <p className="text-light-body/70 dark:text-dark-body/70 text-sm max-w-sm mb-6">
                      Start chatting when you're ready. I'm here to listen, understand, and support your mental wellness journey.
                    </p>
                  </div>

                  {/* Suggested Starters */}
                  <div className="space-y-2 w-full max-w-sm">
                    <p className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold">Conversation starters:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_STARTERS.slice(0, 3).map((starter, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedStarter(starter)}
                          className="px-3 py-2 text-left text-sm rounded-lg bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-body dark:text-dark-body hover:bg-light-secondary/30 dark:hover:bg-dark-secondary/30 transition-colors"
                        >
                          {starter}
                        </button>
                      ))}
                    </div>
                  </div>
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
                      className={`max-w-[85%] sm:max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-light-primary dark:bg-dark-primary text-white rounded-br-none'
                          : 'bg-white/30 dark:bg-white/10 text-light-body dark:text-dark-body border border-white/20 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                      {/* Sentiment Indicator for User Messages */}
                      {message.sender === 'user' && message.sentiment && (
                        <div className={`mt-2 text-xs opacity-80 ${message.sentiment === 'critical' ? 'font-bold' : ''}`}>
                          {getSentimentLabel(message.sentiment)}
                        </div>
                      )}

                      {/* Crisis Detection Alert */}
                      {message.sentiment === 'critical' && (
                        <div className="mt-3 pt-3 border-t border-white/30">
                          <div className="flex items-start gap-2 bg-red-500/20 p-2 rounded">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-red-400">Crisis Support Available</p>
                              <p className="text-xs mt-1 text-red-300">
                                If you're in crisis, please reach out: 988 Suicide & Crisis Lifeline (US)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Analysis Insights */}
                      {message.analysis?.insights && message.sender === 'Shvayam' && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <p className="text-xs font-semibold text-light-accent dark:text-dark-accent mb-1">
                            💡 Insight
                          </p>
                          <p className="text-xs opacity-90">{message.analysis.insights}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-3 sm:p-4 bg-white/10 dark:bg-white/5 border-t border-white/20">
            {/* Sentiment Preview */}
            {messageSentiment && input.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 text-xs mb-2 ${getSentimentColor(messageSentiment)}`}
              >
                <Lightbulb className="w-3 h-3" />
                <span>{getSentimentLabel(messageSentiment)}</span>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-light-body dark:text-dark-body mb-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Shvayam is thinking...</span>
              </div>
            )}

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts..."
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 dark:bg-white/10 text-light-body dark:text-dark-body placeholder-light-body/50 dark:placeholder-dark-body/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 text-sm md:text-base transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Clear History Button */}
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="w-full mt-2 text-xs text-light-body/60 dark:text-dark-body/60 hover:text-light-body dark:hover:text-dark-body transition"
              >
                Clear conversation
              </button>
            )}

            {/* Safety Notice */}
            <p className="text-xs text-light-body/50 dark:text-dark-body/50 mt-2 text-center">
              For emergencies, always contact local emergency services or a crisis helpline
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ChatPage;
