/**
 * ============================================
 * 🤖 BYTEBOT COMPONENT — ByteBot.tsx
 * ============================================
 * 
 * ByteBot is the floating AI assistant seen across the entire app.
 * It provides "Context-Aware" help to users.
 * 
 * CORE FEATURES:
 * 1. Animated Panel: Using Framer Motion for slide-up/scale-down effects.
 * 2. Simulated AI: Uses the `getBotResponse` function to provide fake (but smart) replies.
 * 3. Quick Actions: Buttons that appear initially to guide the user's first questions.
 * 4. Typing Indicator: Animated dots to make the AI feel "real".
 * 5. Markdown Support: **Bold** text rendering in messages.
 * 6. Bot Avatar: Consistent bot identity next to each message.
 * 
 * HINT FOR BEGINNERS:
 * Notice the `renderMarkdown` helper function. It's a simple way to 
 * detect **bold text** in our bot replies and turn them into <strong> tags!
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, X, Send, BookOpen, Trophy, HelpCircle,
  Zap, Sparkles,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import clsx from 'clsx';

// --- Types ---
interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

// --- Quick Action Definitions ---
const quickActions = [
  { id: 'learn', label: 'What should I learn next?', icon: <BookOpen size={14} /> },
  { id: 'xp', label: 'How do I earn more XP?', icon: <Zap size={14} /> },
  { id: 'archetype', label: 'Explain my archetype', icon: <Sparkles size={14} /> },
  { id: 'help', label: 'Help me get started', icon: <HelpCircle size={14} /> },
];

// --- Markdown Renderer (Simple Bold Detection) ---
function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// --- Bot Logic (The "Brain") ---
// HINT: This is where we define how Byte responds to different keywords.
function getBotResponse(input: string, archetype: string | null, userName: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('learn next') || lower.includes('recommend') || lower.includes('what should i learn')) {
    return `Based on your profile, I'd suggest tackling **"Advanced Prompt Engineering"** next. It aligns perfectly with your learning style and will build on what you've already completed! 🚀`;
  }
  if (lower.includes('xp') || lower.includes('points') || lower.includes('earn')) {
    return `Great question! You earn XP by:\n\n• **Completing modules** → 100 XP each\n• **Daily streaks** → 25 XP bonus\n• **Quick Wins** → 50 XP each\n• **Helping peers** → 75 XP\n\nKeep going! 🔥`;
  }
  if (lower.includes('archetype')) {
    return archetype
      ? `You are a **${archetype}**! This means you thrive on structured progress, clear milestones, and hands-on learning. I'll tailor recommendations to match your style!`
      : `You haven't taken the assessment yet! Head to the survey to discover your learning persona. It only takes 8-10 minutes! ✨`;
  }
  if (lower.includes('help') || lower.includes('started') || lower.includes('get started')) {
    return `Welcome to **BeSciAI**! Here's how to get started:\n\n1. **Take the Assessment** to discover your AI archetype\n2. **Start with Basics** in the Learn section\n3. **Try Quick Wins** for instant results\n4. **Connect with Peers** in Community\n\nI'm here whenever you need guidance! 😊`;
  }

  return `I'm here to help! You can ask me about:\n\n• **Learning recommendations**\n• **XP and badges**\n• **Archetype insights**\n• **Getting started**\n\nWhat's on your mind? 😊`;
}

export function ByteBot() {
  const { user, archetype } = useUser();

  // -- Local State --
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // -- Refs & Hooks --
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Initial welcome message when the bot panel first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome', role: 'bot',
        content: `Hi! 👋 I'm **Byte**, your AI learning companion. I can help you navigate your learning path, track progress, and answer questions. What would you like to know?`,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  // -- Actions --
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate AI thinking time
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`, role: 'bot',
        content: getBotResponse(text, archetype, user?.name || ''),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // ============================================
  // SECTION: UI RENDER
  // ============================================
  return (
    <>
      {/* 1. THE CHAT PANEL (Hidden until button is clicked) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bytebot-panel"
          >
            {/* ---- Header with Gradient ---- */}
            <div className="bytebot-header">
              <div className="flex items-center gap-3">
                <div className="bytebot-avatar">
                  <Bot size={22} />
                </div>
                <div>
                  <span className="bytebot-title">Byte</span>
                  <span className="bytebot-subtitle">AI Learning Companion</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
            </div>

            {/* ---- Scrollable Message List ---- */}
            <div className="bytebot-messages space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}
                >
                  {/* Bot Avatar */}
                  {msg.role === 'bot' && (
                    <div className="bytebot-message-bot-avatar">
                      <Bot size={16} className="text-[#5236ab]" />
                    </div>
                  )}
                  {/* Message Bubble */}
                  <div className={clsx(
                    msg.role === 'user' ? 'bytebot-message-bubble-user' : 'bytebot-message-bubble-bot'
                  )}>
                    {renderMarkdown(msg.content)}
                  </div>
                </motion.div>
              ))}

              {/* ---- Quick Action Buttons ---- */}
              {showQuickActions && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => sendMessage(action.label)}
                      className="bytebot-quick-action"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* ---- Typing Indicator (Animated Dots) ---- */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="bytebot-typing-avatar">
                    <Bot size={16} className="text-[#5236ab]" />
                  </div>
                  <div className="bytebot-typing-bubble">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="bytebot-typing-dot"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ---- Form Input ---- */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="bytebot-input-form"
            >
              <input
                ref={inputRef}
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask Byte anything..."
                className="bytebot-input"
              />
              <button
                disabled={!input.trim()}
                className={clsx(
                  'bytebot-send-button',
                  input.trim() ? 'bytebot-send-button-active' : 'bytebot-send-button-disabled'
                )}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE FLOATING BUTTON (Always visible) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bytebot-fab"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot size={28} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="bytebot-fab-pulse"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    </>
  );
}
