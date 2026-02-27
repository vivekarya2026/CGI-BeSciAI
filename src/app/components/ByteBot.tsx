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
 * 
 * HINT FOR BEGINNERS:
 * Notice the `renderMarkdown` helper function. It's a simple way to 
 * detect **bold text** in our bot replies and turn them into <strong> tags!
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, X, Send, Sparkles, BookOpen, Trophy, HelpCircle,
  ChevronRight, Zap, ArrowRight,
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// --- Types ---
interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

// --- Bot Logic (The "Brain") ---
// HINT: This is where we define how Byte responds to different keywords.
function getBotResponse(input: string, archetype: string | null, userName: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('learn next') || lower.includes('recommend')) {
    return `Based on your profile, I'd suggest tackling **"Advanced Prompt Engineering"** next. It aligns perfectly with your learning style!`;
  }
  if (lower.includes('xp') || lower.includes('points')) {
    return `You earn XP by completing modules (100 XP) and maintaining streaks (25 XP bonus). Keep going! 🔥`;
  }
  if (lower.includes('archetype')) {
    return archetype
      ? `You are a **${archetype}**! This means you thrive on structured progress and clear milestones.`
      : `You haven't taken the assessment yet! Head to the survey to discover your persona.`;
  }

  return `I'm here to help! You can ask me about:\n\n• Learning recommendations\n• XP and badges\n• Archetype insights\n\nWhat's on your mind? 😊`;
}

export function ByteBot() {
  const { user, archetype } = useUser();

  // -- Local State --
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // -- Refs & Hooks --
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message when the bot panel first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome', role: 'bot',
        content: `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm **Byte**, your AI companion. How can I help you today?`,
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-[9999] flex flex-col bg-white"
            style={{ bottom: 88, right: 24, width: 360, height: 500, borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            {/* Header with gradient */}
            <div className="flex items-center justify-between px-5 py-4 text-white" style={{ background: 'linear-gradient(135deg, #5236ab 0%, #3a2679 100%)', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold">Byte Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white cursor-pointer opacity-70 hover:opacity-100"><X size={18} /></button>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#5236ab] text-white' : 'bg-white shadow-sm text-gray-800'}`}
                    style={{ borderBottomRightRadius: msg.role === 'user' ? 4 : 16, borderBottomLeftRadius: msg.role === 'bot' ? 4 : 16 }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-gray-400 italic">Byte is thinking...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Form Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="p-3 border-t flex gap-2"
            >
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me something..."
                className="flex-1 px-4 py-2 border rounded-xl outline-none focus:border-[#5236ab] text-sm"
              />
              <button disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-[#5236ab] text-white flex items-center justify-center cursor-pointer disabled:opacity-30">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE FLOATING BUTTON (Always visible) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed z-[9999] bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-xl cursor-pointer flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #5236ab 0%, #3a2679 100%)' }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </motion.button>
    </>
  );
}
