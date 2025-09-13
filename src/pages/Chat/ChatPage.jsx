import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello ${user?.name}, I'm your AI psychiatrist. I'm here to listen and help you work through whatever is on your mind. How are you feeling today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMessage = (message) => {
    const anxietyKeywords = ['anxious', 'worried', 'nervous', 'panic', 'stress'];
    const depressionKeywords = ['sad', 'depressed', 'hopeless', 'lonely', 'empty'];
    const positiveKeywords = ['happy', 'good', 'great', 'better', 'positive'];
    
    const lowerMessage = message.toLowerCase();
    
    if (anxietyKeywords.some(word => lowerMessage.includes(word))) {
      return 'anxiety';
    } else if (depressionKeywords.some(word => lowerMessage.includes(word))) {
      return 'depression';
    } else if (positiveKeywords.some(word => lowerMessage.includes(word))) {
      return 'positive';
    }
    return 'neutral';
  };

  const generateAIResponse = (userMessage, sentiment) => {
    const responses = {
      anxiety: [
        "I understand you're feeling anxious. That's completely valid. Can you tell me what specifically is causing these anxious feelings?",
        "Anxiety can feel overwhelming. Let's try a quick breathing exercise: breathe in for 4 counts, hold for 4, and breathe out for 6. How does that feel?",
        "Thank you for sharing that with me. Anxiety is very treatable. What coping strategies have you tried before?"
      ],
      depression: [
        "I hear that you're going through a difficult time. Your feelings are valid, and I'm here to support you. What has been the hardest part of your day?",
        "Depression can make everything feel heavy. You're brave for reaching out. Have you been able to maintain any daily routines?",
        "I'm glad you're talking about this. Small steps can make a big difference. What's one small thing that brought you even a moment of peace recently?"
      ],
      positive: [
        "It's wonderful to hear you're feeling good! What's contributing to these positive feelings?",
        "That's great to hear! Celebrating positive moments is important. How can we help you maintain this feeling?",
        "I'm so glad you're having a good day. What strategies or activities helped you feel this way?"
      ],
      neutral: [
        "Thank you for sharing that with me. Can you tell me more about what you're experiencing?",
        "I'm listening. How has your week been overall?",
        "That's interesting. How do you feel about that situation?",
        "Can you help me understand what's on your mind right now?"
      ]
    };

    const sentimentResponses = responses[sentiment] || responses.neutral;
    return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const sentiment = analyzeMessage(inputMessage);
      const aiResponse = generateAIResponse(inputMessage, sentiment);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        sentiment: sentiment,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </Link>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-8 space-x-4">
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-primary)] font-medium px-3 py-2 rounded-md text-sm">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Assessments
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </nav>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="text-primary-600 dark:text-primary-400 font-medium block px-3 py-2 rounded-md text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Chat
                </Link>
                <Link
                  to="/assessments"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Assessments
                </Link>
                <Link
                  to="/profile"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </div>
                  <div className="px-3">
                    <Button variant="secondary" size="sm" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="glass p-4">
          <h1 className="text-lg sm:text-xl font-semibold text-[var(--color-text)]">
            AI Psychiatrist Chat
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Safe space for mental health conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[var(--color-primary)] text-white shadow'
                    : 'glass text-[var(--color-text)]'
                }`}
              >
                <p className="text-sm sm:text-base">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="glass p-3 sm:p-4">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 glass-input px-3 py-3 sm:py-2 text-base sm:text-sm rounded-md placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              rows="2"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              variant="primary"
              size="lg"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
