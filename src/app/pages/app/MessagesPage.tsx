/**
 * ============================================
 * 💬 MESSAGES PAGE — MessagesPage.tsx
 * ============================================
 * 
 * This is the direct communication hub. Users can chat with 
 * peers they've connected with in the Community.
 * 
 * HOW IT WORKS:
 * 1. Peer List (Left): Shows all current conversations with unread badges.
 * 2. Chat Area (Right): The active conversation history and message input.
 * 3. Find Peers: A toggleable panel to see suggested new connections.
 * 
 * HINT FOR BEGINNERS:
 * We use `useEffect` hooks here to automatically scroll the chat to 
 * the bottom whenever a new message is sent or received. This keeps the 
 * newest content visible!
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Search, Phone, Video, MoreHorizontal, Smile, Paperclip,
  ArrowLeft, UserPlus, Check, CheckCheck, ChevronRight, MessageSquare,
  Star, Pin, Circle, Users, Sparkles,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

// ============================================
// SECTION 1: DATA INTERFACES (Types)
// ============================================
interface Peer {
  id: string;
  name: string;
  avatar: string;
  archetype: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
  connected: boolean;
  expertise?: string[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  peerId: string;
  messages: ChatMessage[];
  lastActivity: string;
  unread: number;
  pinned?: boolean;
}

// ============================================
// SECTION 2: MOCK DATA
// ============================================
const peers: Peer[] = [
  { id: 'p1', name: 'Sarah K.', avatar: '👩‍💻', archetype: 'Trailblazer', status: 'online', connected: true, expertise: ['Prompt Engineering', 'Productivity'] },
  { id: 'p2', name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator', status: 'online', connected: true, expertise: ['Automation', 'Data Analysis'] },
  { id: 'p3', name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide', status: 'away', lastSeen: '15 min ago', connected: true, expertise: ['AI Ethics', 'Prompt Engineering'] },
  { id: 'p4', name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide', status: 'online', connected: true, expertise: ['Content', 'Communication'] },
  { id: 'p5', name: 'James L.', avatar: '👨‍💼', archetype: 'Connector', status: 'offline', lastSeen: '2 hours ago', connected: true, expertise: ['Leadership', 'Strategy'] },
  { id: 'p7', name: 'Jordan T.', avatar: '🏆', archetype: 'Champion', status: 'online', connected: false, expertise: ['Competition', 'Performance'] },
];

const initialConversations: Conversation[] = [
  {
    peerId: 'p1', lastActivity: '2 min ago', unread: 2, pinned: true,
    messages: [
      { id: 'm1', senderId: 'p1', text: 'Hey! I saw your workflow post — that was really helpful!', time: '10:30 AM', status: 'read' },
      { id: 'm2', senderId: 'me', text: 'Thanks, Sarah! Glad it was useful. Have you tried the chain-of-thought approach?', time: '10:35 AM', status: 'read' },
      { id: 'm3', senderId: 'p1', text: 'Yes! I wrote about it in the forum. The step-by-step breakdown really improved my outputs by about 40%.', time: '10:42 AM', status: 'read' },
      { id: 'm5', senderId: 'p1', text: 'Absolutely! Are you free for a quick chat later today? I also wanted to discuss the automation challenge.', time: '11:20 AM', status: 'delivered' },
    ],
  },
  {
    peerId: 'p2', lastActivity: '1 hour ago', unread: 0,
    messages: [
      { id: 'm7', senderId: 'p2', text: 'Just automated my entire weekly report generation. Saved 3 hours!', time: 'Yesterday', status: 'read' },
      { id: 'm8', senderId: 'me', text: 'Wow, that\'s incredible! Can you walk me through the setup?', time: 'Yesterday', status: 'read' },
    ],
  },
];

const archetypeColors: Record<string, string> = {
  Trailblazer: '#f59e0b', Guide: '#14b8a6', Connector: '#8b5cf6',
  Explorer: '#0ea5e9', Champion: '#e31937', Innovator: '#84cc16',
};

const statusColors: Record<string, string> = {
  online: '#1ab977', away: '#f1a425', offline: '#a8a8a8',
};

// ============================================
// SECTION 3: COMPONENT LOGIC
// ============================================

export default function MessagesPage() {
  const { user } = useUser();

  // -- State Management --
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>('p1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // -- Refs for DOM access --
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // -- Derived Data --
  const selectedPeer = peers.find(p => p.id === selectedPeerId);
  const selectedConvo = conversations.find(c => c.peerId === selectedPeerId);
  const suggestedPeers = peers.filter(p => !p.connected);

  // -- Helpers --
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Run scrollToBottom whenever the message list grows
  useEffect(() => {
    scrollToBottom();
  }, [selectedConvo?.messages.length, selectedPeerId]);

  // Mark unread as 0 when a conversation is opened
  useEffect(() => {
    if (selectedPeerId) {
      setConversations(prev =>
        prev.map(c => c.peerId === selectedPeerId ? { ...c, unread: 0 } : c)
      );
    }
  }, [selectedPeerId]);

  // -- Send Message Action --
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedPeerId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setConversations(prev => {
      const existing = prev.find(c => c.peerId === selectedPeerId);
      if (existing) {
        return prev.map(c =>
          c.peerId === selectedPeerId
            ? { ...c, messages: [...c.messages, newMsg], lastActivity: 'Just now' }
            : c
        );
      } else {
        return [{ peerId: selectedPeerId, messages: [newMsg], lastActivity: 'Just now', unread: 0 }, ...prev];
      }
    });
    setMessageInput('');

    // SIMULATED REPLY: Waits 2 seconds and adds a fake response
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: selectedPeerId,
        text: "That sounds great! I'll share my notes from the latest session.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setConversations(prev =>
        prev.map(c => c.peerId === selectedPeerId ? { ...c, messages: [...c.messages, autoReply], lastActivity: 'Just now' } : c)
      );
    }, 2000);
  };

  // ============================================
  // SECTION 4: RENDER UI
  // ============================================

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* --- Page Header --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }}>Messages</h1>
          <p style={{ fontSize: 16, color: '#5c5c5c', lineHeight: '24px' }}>
            Chat with your connected peers and grow together.
          </p>
        </div>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-none cursor-pointer transition-colors"
          style={{ backgroundColor: showSuggestions ? '#5236ab' : '#f2f1f9', color: showSuggestions ? 'white' : '#5236ab', fontSize: 14, fontWeight: 600 }}
        >
          <UserPlus size={16} /> <span className="hidden sm:inline">Find Peers</span>
        </button>
      </div>

      {/* --- Suggested Connections Panel (Animated) --- */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} style={{ color: '#5236ab' }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#151515', margin: 0 }}>Suggested Connections</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {suggestedPeers.map(peer => (
                  <div key={peer.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <span className="text-2xl">{peer.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-semibold" style={{ fontSize: 14 }}>{peer.name}</span>
                      <span style={{ fontSize: 11, color: '#767676' }}>{peer.archetype}</span>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-[#5236ab] text-white text-xs font-bold cursor-pointer">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Layout Grid --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex" style={{ height: 'calc(100vh - 280px)', minHeight: 450 }}>

        {/* SIDEBAR: Conversation list */}
        <div className={`shrink-0 border-r border-gray-100 flex flex-col w-full lg:w-80 ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-100 outline-none focus:border-[#5236ab]"
                style={{ fontSize: 14, backgroundColor: '#f8f9fb' }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map(convo => {
              const peer = peers.find(p => p.id === convo.peerId);
              if (!peer) return null;
              const isSelected = selectedPeerId === convo.peerId;
              const lastMsg = convo.messages[convo.messages.length - 1];
              return (
                <div
                  key={convo.peerId} onClick={() => { setSelectedPeerId(convo.peerId); setMobileView('chat'); }}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-colors"
                  style={{ backgroundColor: isSelected ? '#f2f1f9' : 'transparent' }}
                >
                  <div className="relative shrink-0">
                    <span className="text-2xl">{peer.avatar}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: statusColors[peer.status] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="truncate font-semibold text-sm" style={{ color: '#151515' }}>{peer.name}</span>
                      <span style={{ fontSize: 11, color: '#a8a8a8' }}>{convo.lastActivity}</span>
                    </div>
                    <p className="truncate text-xs text-gray-400">{lastMsg?.text}</p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#5236ab] text-white text-[10px] font-bold">
                      {convo.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CHAT WINDOW */}
        <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          {selectedPeer ? (
            <>
              {/* Chat Window Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
                <button onClick={() => setMobileView('list')} className="lg:hidden p-1 cursor-pointer"><ArrowLeft size={18} /></button>
                <span className="text-xl">{selectedPeer.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ fontSize: 15 }}>{selectedPeer.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: archetypeColors[selectedPeer.archetype] }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#a8a8a8' }}>{selectedPeer.status}</span>
                </div>
              </div>

              {/* Message History Container */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ backgroundColor: '#f8f9fb' }}>
                {selectedConvo?.messages.map((msg) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[75%] px-4 py-3 rounded-2xl"
                        style={{
                          backgroundColor: isMe ? '#5236ab' : 'white',
                          color: isMe ? 'white' : '#333333',
                          fontSize: 14,
                          boxShadow: isMe ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {msg.text}
                        <div className="mt-1 text-[10px] opacity-60 text-right">{msg.time}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} /> {/* This empty div acts as a scroll target */}
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-gray-100 flex items-center gap-3">
                <input
                  ref={inputRef} type="text" value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Message ${selectedPeer.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5236ab]"
                />
                <button
                  onClick={sendMessage} disabled={!messageInput.trim()}
                  className="w-10 h-10 rounded-xl bg-[#5236ab] text-white flex items-center justify-center cursor-pointer disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-4" />
              <p>Select a peer to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
