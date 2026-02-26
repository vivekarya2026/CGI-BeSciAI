import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, X, Send, Sparkles, BookOpen, Trophy, HelpCircle,
  ChevronRight, Zap, ArrowRight,
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'What should I learn next?', icon: <BookOpen size={14} /> },
  { label: 'How do I earn more XP?', icon: <Zap size={14} /> },
  { label: 'Explain my archetype', icon: <Sparkles size={14} /> },
  { label: 'Help me get started', icon: <HelpCircle size={14} /> },
];

function getBotResponse(input: string, archetype: string | null, userName: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('learn next') || lower.includes('recommend') || lower.includes('next module')) {
    return `Based on your ${archetype || 'learning'} profile, I'd suggest tackling **"Advanced Prompt Engineering"** next. It builds on your current skills and aligns with your learning style. Want me to tell you more about it?`;
  }
  if (lower.includes('xp') || lower.includes('points') || lower.includes('earn')) {
    return `Great question! Here's how to earn more XP:\n\n• **Complete modules** — 100 XP each\n• **Daily streak bonus** — 25 XP/day\n• **Help a peer** — 50 XP\n• **Earn badges** — 150 XP each\n\nYour streak multiplier is active, so keep logging in daily! 🔥`;
  }
  if (lower.includes('archetype') || lower.includes('my type') || lower.includes('personality')) {
    if (archetype) {
      return `You're **${archetype}**! This means you tend to be a self-directed learner who values structured progress. Your learning path is personalized to match this style — focusing on hands-on exercises and clear milestones. Want tips on how to make the most of your archetype?`;
    }
    return `It looks like you haven't completed the archetype assessment yet. Take the survey to discover your AI adoption personality and unlock a personalized learning path!`;
  }
  if (lower.includes('get started') || lower.includes('begin') || lower.includes('new here') || lower.includes('help')) {
    return `Welcome${userName ? `, ${userName}` : ''}! Here's how to get the most out of the platform:\n\n1. **Dashboard** — Track your progress and streaks\n2. **Learn** — Follow your personalized learning path\n3. **Community** — Connect with fellow learners\n4. **Profile** — View your badges and archetype\n\nI'm always here if you need guidance! Just ask. 😊`;
  }
  if (lower.includes('badge') || lower.includes('achievement')) {
    return `Badges are earned by hitting milestones! Some upcoming ones:\n\n🏅 **Module Master** — Complete 5 modules\n⭐ **Prompt Pro** — Finish the prompt engineering track\n🤝 **Mentor** — Help 3 peers in the community\n\nKeep going — you're close to your next badge!`;
  }
  if (lower.includes('streak') || lower.includes('daily')) {
    return `Your daily streak rewards consistency! Log in and complete at least one activity each day to maintain it. After 7 days, you'll unlock a **streak multiplier** that boosts all XP earned by 1.5x! 🔥`;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hey${userName ? ` ${userName}` : ''}! 👋 I'm Byte, your AI learning companion. How can I help you today?`;
  }
  if (lower.includes('thank')) {
    return `You're welcome! I'm always here to help. Keep up the great work on your AI journey! 🚀`;
  }

  return `That's a great question! While I'm still learning, here are some things I can help with:\n\n• Learning path recommendations\n• XP and badge guidance\n• Archetype insights\n• Getting started tips\n\nTry asking me about any of these! 😊`;
}

export function ByteBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, archetype } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          content: `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm **Byte**, your AI learning companion. I can help you navigate your learning path, track progress, and answer questions. What would you like to know?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(text, archetype, user?.name?.split(' ')[0] || '');
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown: bold and newlines
    const parts = text.split('\n').map((line, i) => {
      const boldParsed = line.split(/(\*\*[^*]+\*\*)/).map((seg, j) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return (
            <strong key={j} style={{ fontWeight: 700 }}>
              {seg.slice(2, -2)}
            </strong>
          );
        }
        return seg;
      });
      return (
        <span key={i}>
          {i > 0 && <br />}
          {boldParsed}
        </span>
      );
    });
    return <>{parts}</>;
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed z-[9999] flex flex-col"
            style={{
              bottom: 88,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: 520,
              maxHeight: 'calc(100vh - 120px)',
              borderRadius: 16,
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              fontFamily: 'var(--font-primary)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #5236ab 0%, #3a2679 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <Bot size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', lineHeight: '20px', margin: 0 }}>
                    Byte
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: '14px', margin: 0 }}>
                    AI Learning Companion
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                aria-label="Close chat"
              >
                <X size={16} color="#ffffff" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ backgroundColor: '#f8f9fb' }}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                      style={{ backgroundColor: '#f2f1f9' }}
                    >
                      <Bot size={14} style={{ color: '#5236ab' }} />
                    </div>
                  )}
                  <div
                    className="max-w-[75%] px-4 py-3 rounded-2xl"
                    style={{
                      backgroundColor: msg.role === 'user' ? '#5236ab' : '#ffffff',
                      color: msg.role === 'user' ? '#ffffff' : '#333333',
                      fontSize: 14,
                      lineHeight: '20px',
                      fontWeight: 400,
                      boxShadow: msg.role === 'bot' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      borderTopRightRadius: msg.role === 'user' ? 6 : 16,
                      borderTopLeftRadius: msg.role === 'bot' ? 6 : 16,
                    }}
                  >
                    {renderMarkdown(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                    style={{ backgroundColor: '#f2f1f9' }}
                  >
                    <Bot size={14} style={{ color: '#5236ab' }} />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{
                      backgroundColor: '#ffffff',
                      borderTopLeftRadius: 6,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#a8a8a8' }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions (show after welcome only) */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      onClick={() => sendMessage(action.label)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer transition-all"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#5236ab',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e6e3f3',
                        lineHeight: '16px',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#f2f1f9';
                        e.currentTarget.style.borderColor = '#cbc3e6';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#e6e3f3';
                      }}
                    >
                      {action.icon}
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{
                backgroundColor: '#ffffff',
                borderTop: '1px solid #efefef',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Byte anything..."
                className="flex-1 outline-none"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#333333',
                  lineHeight: '20px',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid #e6e3f3',
                  backgroundColor: '#f8f9fb',
                  fontFamily: 'var(--font-primary)',
                  transition: 'border-color 150ms ease',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#5236ab')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e6e3f3')}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all"
                style={{
                  backgroundColor: input.trim() ? '#5236ab' : '#e6e3f3',
                  color: input.trim() ? '#ffffff' : '#a8a8a8',
                }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed z-[9999] flex items-center justify-center cursor-pointer"
        style={{
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5236ab 0%, #3a2679 100%)',
          boxShadow: '0 4px 16px rgba(82, 54, 171, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
          border: 'none',
          color: '#ffffff',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 6px 24px rgba(82, 54, 171, 0.5), 0 2px 4px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close Byte assistant' : 'Open Byte assistant'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <Bot size={26} />
              {/* Pulse indicator */}
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full"
                style={{ backgroundColor: '#1ab977', border: '2px solid #5236ab' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
