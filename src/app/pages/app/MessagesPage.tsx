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
  Send, Search, Smile, Paperclip,
  ArrowLeft, UserPlus, CheckCheck, MessageSquare,
  Sparkles, Circle,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import clsx from 'clsx';

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
  { id: 'p6', name: 'Jordan T.', avatar: '🏆', archetype: 'Champion', status: 'online', connected: false, expertise: ['Competition', 'Performance'] },
  { id: 'p7', name: 'Sophie Laurent', avatar: '👩‍🔬', archetype: 'Trailblazer', status: 'online', connected: false, expertise: ['Data Analysis', 'Leadership'] },
  { id: 'p8', name: 'Ana P.', avatar: '👩‍💻', archetype: 'Connector', status: 'online', connected: false, expertise: ['Community', 'Networking'] },
];

const initialConversations: Conversation[] = [
  {
    peerId: 'p1', lastActivity: '2 min ago', unread: 0, pinned: true,
    messages: [
      { id: 'm1', senderId: 'p1', text: 'Hey! I saw your workflow post — that was really helpful!', time: '10:30 AM', status: 'read' },
      { id: 'm2', senderId: 'me', text: 'Thanks, Sarah! Glad it was useful. Have you tried the chain-of-thought approach?', time: '10:35 AM', status: 'read' },
      { id: 'm3', senderId: 'p1', text: 'Yes! I wrote about it in the forum. The step-by-step breakdown really improved my outputs by about 40%.', time: '10:42 AM', status: 'read' },
      { id: 'm4', senderId: 'me', text: "That's amazing! Would love to compare notes sometime.", time: '10:45 AM', status: 'read' },
      { id: 'm5', senderId: 'p1', text: 'Absolutely! Are you free for a quick chat later today? I also wanted to discuss the automation challenge.', time: '11:20 AM', status: 'delivered' },
      { id: 'm6', senderId: 'p1', text: 'Also, have you seen the new prompt template that Mike shared? It\'s really good for data analysis tasks.', time: '11:22 AM', status: 'delivered' },
    ],
  },
  {
    peerId: 'p2', lastActivity: '1 hour ago', unread: 0,
    messages: [
      { id: 'm7', senderId: 'p2', text: 'Just automated my entire weekly report generation. Saved 3 hours!', time: 'Yesterday', status: 'read' },
      { id: 'm8', senderId: 'me', text: 'Wow, that\'s incredible! Can you walk me through the setup?', time: 'Yesterday', status: 'read' },
      { id: 'm9', senderId: 'p2', text: 'Sure thing! I used a combination of API calls and a prompt template. Let me send you the details.', time: 'Yesterday', status: 'read' },
      { id: 'm10', senderId: 'me', text: 'Looking forward to it! I\'ll keep an eye out for it.', time: '1 hour ago', status: 'read' },
    ],
  },
  {
    peerId: 'p3', lastActivity: '3 hours ago', unread: 1,
    messages: [
      { id: 'm11', senderId: 'me', text: 'Hi Dr. Chen! I had a question about the ethics module from the workshop.', time: 'Yesterday', status: 'read' },
      { id: 'm12', senderId: 'p3', text: 'Of course! Happy to help. What would you like to know?', time: 'Yesterday', status: 'read' },
      { id: 'm13', senderId: 'me', text: 'How should we approach data anonymization when using AI tools with client data?', time: 'Yesterday', status: 'read' },
      { id: 'm14', senderId: 'p3', text: 'I\'d recommend starting with the "Prompt Engineering" module — it covers data handling best practices.', time: '3 hours ago', status: 'delivered' },
    ],
  },
  {
    peerId: 'p4', lastActivity: 'Yesterday', unread: 0,
    messages: [
      { id: 'm15', senderId: 'p4', text: 'I just finished the content strategy workflow — it works great!', time: 'Yesterday', status: 'read' },
      { id: 'm16', senderId: 'me', text: 'Awesome! DM me if you want to collaborate on the next one.', time: 'Yesterday', status: 'read' },
      { id: 'm17', senderId: 'p4', text: 'Thank you so much! It\'s been a game-changer for my content creation process.', time: 'Yesterday', status: 'read' },
    ],
  },
  {
    peerId: 'p5', lastActivity: '2 days ago', unread: 0,
    messages: [
      { id: 'm18', senderId: 'p5', text: 'Hey! Would love to connect on the leadership AI integration project.', time: '2 days ago', status: 'read' },
      { id: 'm19', senderId: 'me', text: 'Will do, James! Thanks for the offer.', time: '2 days ago', status: 'read' },
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
  const onlinePeersCount = peers.filter(p => p.connected && p.status === 'online').length;

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

  // Get preview text for conversation list
  const getPreviewText = (convo: Conversation) => {
    const lastMsg = convo.messages[convo.messages.length - 1];
    if (!lastMsg) return '';
    const prefix = lastMsg.senderId === 'me' ? 'You: ' : '';
    return prefix + lastMsg.text;
  };

  // ============================================
  // SECTION 4: RENDER UI
  // ============================================

  return (
    <div className="font-primary">
      {/* --- Page Header --- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="messages-header-title">Messages</h1>
          <p className="messages-header-subtitle">
            Chat with your connected peers and grow together.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="find-peers-button"
        >
          <UserPlus size={16} /> <span className="hidden sm:inline">Find Peers</span>
        </motion.button>
      </motion.div>

      {/* --- Suggested Connections Panel (Animated) --- */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden mb-6"
          >
            <div className="suggestions-panel">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-[#5236ab]" />
                <h3 className="suggestions-title">
                  Suggested Connections
                </h3>
                <span className="suggestions-subtitle">
                  Based on your archetype and interests
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {suggestedPeers.map((peer, i) => (
                  <motion.div
                    key={peer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="peer-suggestion-card"
                  >
                    <div className="peer-avatar">
                      <span className="text-2xl">{peer.avatar}</span>
                      <span
                        className="status-dot"
                        style={{ backgroundColor: statusColors[peer.status] }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="peer-name">
                        {peer.name}
                      </span>
                      <div className="archetype-indicator">
                        <span
                          className="archetype-dot"
                          style={{ backgroundColor: archetypeColors[peer.archetype] || '#8b5cf6' }}
                        />
                        <span className="archetype-name-small">{peer.archetype}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="connect-button"
                    >
                      Connect
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Layout Grid --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="chat-container"
      >
        {/* SIDEBAR: Conversation list */}
        <div
          className={clsx('conversation-sidebar', {
            'hidden lg:flex': mobileView === 'chat',
            'flex': mobileView === 'list',
          })}
        >
          {/* Search */}
          <div className="conversation-search-container">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-hint" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="conversation-search-input"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((convo, index) => {
              const peer = peers.find(p => p.id === convo.peerId);
              if (!peer) return null;
              const isSelected = selectedPeerId === convo.peerId;
              const previewText = getPreviewText(convo);
              return (
                <motion.div
                  key={convo.peerId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => { setSelectedPeerId(convo.peerId); setMobileView('chat'); }}
                  className={clsx('conversation-item', {
                    'conversation-item-selected': isSelected,
                    'conversation-item-unselected': !isSelected,
                  })}
                  whileHover={{ backgroundColor: isSelected ? undefined : 'var(--app-surface-hover)' }}
                >
                  {/* Avatar with status dot */}
                  <div className="peer-avatar">
                    <span className="text-2xl">{peer.avatar}</span>
                    <span
                      className="status-dot"
                      style={{ backgroundColor: statusColors[peer.status] }}
                    />
                  </div>

                  {/* Name + preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="conversation-name">
                        {peer.name}
                      </span>
                      <span
                        className={clsx('conversation-time', {
                          'conversation-time-unread': convo.unread > 0,
                          'conversation-time-read': convo.unread === 0,
                        })}
                      >
                        {convo.lastActivity}
                      </span>
                    </div>
                    <p
                      className={clsx('conversation-preview', {
                        'conversation-preview-unread': convo.unread > 0,
                        'conversation-preview-read': convo.unread === 0,
                      })}
                    >
                      {previewText}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {convo.unread > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="unread-badge"
                    >
                      {convo.unread}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Online peers indicator */}
          <div className="online-indicator">
            <span className="online-dot" />
            <span className="online-text">
              {onlinePeersCount} peers online
            </span>
          </div>
        </div>

        {/* MAIN CHAT WINDOW */}
        <div className={clsx('flex-1 flex flex-col', {
          'hidden lg:flex': mobileView === 'list',
          'flex': mobileView === 'chat',
        })}>
          {selectedPeer ? (
            <>
              {/* Chat Window Header */}
              <div className="chat-header">
                <button
                  onClick={() => setMobileView('list')}
                  className="back-button-mobile lg:hidden"
                >
                  <ArrowLeft size={18} />
                </button>

                {/* Avatar + name block */}
                <div className="peer-avatar">
                  <span className="text-xl">{selectedPeer.avatar}</span>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: statusColors[selectedPeer.status] }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="chat-peer-name">
                      {selectedPeer.name}
                    </span>
                    <span
                      className="archetype-dot"
                      style={{ backgroundColor: archetypeColors[selectedPeer.archetype] }}
                    />
                    <span className="archetype-name-small">
                      {selectedPeer.archetype}
                    </span>
                  </div>
                  <span
                    className={clsx('chat-status-text', {
                      'chat-status-online': selectedPeer.status === 'online',
                      'chat-status-offline': selectedPeer.status !== 'online',
                    })}
                  >
                    {selectedPeer.status === 'online'
                      ? 'Online'
                      : selectedPeer.status === 'away'
                        ? `Away · ${selectedPeer.lastSeen || 'recently'}`
                        : `Offline · ${selectedPeer.lastSeen || 'a while ago'}`}
                  </span>
                </div>

                {/* Expertise tags */}
                {selectedPeer.expertise && (
                  <div className="hidden md:flex items-center gap-2">
                    {selectedPeer.expertise.map(tag => (
                      <span key={tag} className="expertise-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Message History Container */}
              <div className="messages-area">
                {selectedConvo?.messages.map((msg, i) => {
                  const isMe = msg.senderId === 'me';
                  const msgPeer = !isMe ? peers.find(p => p.id === msg.senderId) : null;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                    >
                      {/* Avatar for received messages */}
                      {!isMe && msgPeer && (
                        <span className="text-lg shrink-0 mb-1">{msgPeer.avatar}</span>
                      )}
                      <div
                        className={clsx({
                          'message-bubble-sent': isMe,
                          'message-bubble-received': !isMe,
                        })}
                      >
                        {msg.text}
                        <div
                          className="flex items-center gap-1 mt-1"
                          style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}
                        >
                          <span className="message-time">{msg.time}</span>
                          {isMe && (
                            <CheckCheck
                              size={13}
                              style={{
                                opacity: 0.7,
                                color: msg.status === 'read' ? '#a5d6ff' : 'rgba(255,255,255,0.5)',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="message-input-container">
                {/* Paperclip */}
                <button
                  className="attach-button"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>

                {/* Text input */}
                <div className="message-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message ${selectedPeer.name}...`}
                    className="message-input"
                  />
                  {/* Emoji button inside input */}
                  <button className="emoji-button">
                    <Smile size={18} />
                  </button>
                </div>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className={clsx('send-button', {
                    'send-button-active': messageInput.trim(),
                  })}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </>
          ) : (
            <div className="empty-chat-state">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <MessageSquare size={48} className="empty-chat-icon mx-auto" />
                <p className="empty-chat-text">Select a peer to start chatting</p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
