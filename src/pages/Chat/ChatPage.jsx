import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';

// --- SVG Icon Components ---
const FiSend = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const FiCpu = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
);
const FiMenu = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const FiPlus = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const FiTrash2 = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const ChatPage = () => {
  const { user } = useAuth();
  const getInitialMessage = () => `Hello ${user?.name || 'there'}, I'm PsyMitrix AI, your personal AI companion. I'm here to listen and help you work through whatever is on your mind. How are you feeling today?`;

  const [sessions, setSessions] = useState([
    { id: 1, title: 'Welcome Chat', messages: [{ id: 1, role: 'model', content: getInitialMessage() }] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId), [sessions, activeSessionId]);

  const generateAIResponse = async (history) => {
    setIsTyping(true);
    setError(null);
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const systemPrompt = "You are PsyMitrix AI, a personal AI companion... Keep your responses conversational and concise, typically 1-3 sentences.";

    const payload = {
        contents: history.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })),
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const result = await response.json();
        const candidate = result.candidates?.[0];
        if (candidate?.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
        } else {
            throw new Error("Received an invalid response from the AI.");
        }
    } catch (e) {
        console.error(e);
        setError("I'm having trouble connecting right now. Please try again in a moment.");
        return null;
    } finally {
        setIsTyping(false);
    }
  };
  
  const updateSessionMessages = (sessionId, newMessages) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: newMessages } : s));
  };
  
  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || !activeSession) return;

    const userMessage = { id: Date.now(), role: 'user', content: messageContent };
    const updatedMessages = [...activeSession.messages, userMessage];
    updateSessionMessages(activeSessionId, updatedMessages);
    setInputMessage('');
    
    const aiResponseContent = await generateAIResponse(updatedMessages);

    if (aiResponseContent) {
        const aiMessage = { id: Date.now() + 1, role: 'model', content: aiResponseContent };
        updateSessionMessages(activeSessionId, [...updatedMessages, aiMessage]);
    }
  };

  const handleNewChat = () => {
      const newSessionId = Date.now();
      const newSession = {
          id: newSessionId,
          title: `New Chat - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          messages: [{ id: 1, role: 'model', content: getInitialMessage() }]
      };
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(newSessionId);
      setIsSidebarOpen(false);
  };
  
  const handleDeleteSession = (e, sessionIdToDelete) => {
    e.stopPropagation(); 
    
    const newSessions = sessions.filter(s => s.id !== sessionIdToDelete);

    if (activeSessionId === sessionIdToDelete) {
        if (newSessions.length > 0) {
            setActiveSessionId(newSessions[0].id);
        } else {
            const newSessionId = Date.now();
            const welcomeSession = {
                id: newSessionId,
                title: 'Welcome Chat',
                messages: [{ id: 1, role: 'model', content: getInitialMessage() }]
            };
            setSessions([welcomeSession]);
            setActiveSessionId(newSessionId);
            return; 
        }
    }
    setSessions(newSessions);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const Sidebar = () => (
    <aside className={`absolute md:relative z-20 w-64 h-full bg-white/10 dark:bg-gray-800/50 glass border-r border-white/10 dark:border-gray-700/50 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
            <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-light-primary/80 dark:bg-dark-primary/80 text-white hover:bg-light-primary dark:hover:bg-dark-primary transition-colors">
                <FiPlus/> New Chat
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map(session => (
                <div key={session.id} onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
                   className={`group flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer ${activeSessionId === session.id ? 'bg-white/20 dark:bg-gray-700' : 'hover:bg-white/10 dark:hover:bg-gray-700/50'}`}>
                    <span className="truncate pr-2">{session.title}</span>
                    <button onClick={(e) => handleDeleteSession(e, session.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
                      <FiTrash2 className="w-4 h-4"/>
                    </button>
                </div>
            ))}
        </nav>
    </aside>
  );

  return (
    <div className="bg-light-background dark:bg-dark-background font-sans text-light-body dark:text-dark-body flex items-center justify-center p-0 sm:p-4">
      <div className="flex h-full sm:h-[90vh] w-full lg:w-[60vw] sm:rounded-2xl shadow-2xl overflow-hidden bg-white/5 dark:bg-gray-800/20 backdrop-blur-2xl border border-white/10 dark:border-gray-700/50">
        <Sidebar/>
        <main className="flex-1 flex flex-col h-full bg-white/5 dark:bg-black/10">
          <header className="flex items-center p-4 border-b border-white/10 dark:border-gray-700/80 bg-light-background/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden mr-4 p-2 rounded-md hover:bg-white/10">
                  <FiMenu/>
              </button>
              <h1 className="text-lg font-semibold text-light-headings dark:text-dark-headings truncate">{activeSession?.title || 'Chat'}</h1>
          </header>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              {activeSession?.messages.length <= 1 && (
                <div className="text-center p-8 my-8">
                    <div className="inline-block p-4 bg-light-secondary/80 dark:bg-dark-secondary/80 rounded-full mb-4 animate-fade-in-up">
                        <FiCpu className="w-10 h-10 text-white"/>
                    </div>
                    <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Session with PsyMitrix AI
                    </h2>
                    <p className="mt-2 text-md text-light-body dark:text-dark-body max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        This is a safe space to explore your thoughts. Start by telling me what's on your mind, or try a suggested prompt.
                    </p>
                </div>
              )}
              {activeSession?.messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-3 my-4 animate-fade-in-up ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-light-secondary/80 dark:bg-dark-secondary/80 flex-shrink-0 flex items-center justify-center text-white"><FiCpu className="w-5 h-5"/></div>
                  )}
                  <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-md ${message.role === 'user' ? 'bg-light-primary/90 dark:bg-dark-primary/90 text-white rounded-br-lg' : 'bg-white/50 dark:bg-gray-700/50 text-light-headings dark:text-dark-headings rounded-bl-lg'}`}>
                    <p className="text-base whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-3 my-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-light-secondary/80 dark:bg-dark-secondary/80 flex-shrink-0 flex items-center justify-center text-white"><FiCpu className="w-5 h-5"/></div>
                  <div className="p-4 rounded-2xl shadow-md bg-white/50 dark:bg-gray-700/50">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-light-body dark:bg-dark-body rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-light-body dark:bg-dark-body rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-light-body dark:bg-dark-body rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {error && <div className="text-center text-red-500 text-sm py-4">{error}</div>}
            </div>
          </div>
          <footer className="bg-light-background/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-white/10 dark:border-gray-700/50 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Share what's on your mind..."
                  className="w-full h-14 pl-4 pr-16 py-4 resize-none rounded-xl bg-white/20 dark:bg-gray-800/80 text-light-headings dark:text-dark-headings placeholder:text-light-body/70 dark:placeholder:text-dark-body/70 border border-white/30 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary shadow-md transition-all overflow-hidden"
                  rows="1" />
                <button onClick={() => handleSendMessage(inputMessage)} disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary/80 dark:hover:bg-dark-primary/80 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;

