import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Search, Phone, Video, MoreHorizontal, Smile, Paperclip,
  ArrowLeft, UserPlus, Check, CheckCheck, ChevronRight, MessageSquare,
  Star, Pin, Circle, Users, Sparkles,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

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

const peers: Peer[] = [
  { id: 'p1', name: 'Sarah K.', avatar: '👩‍💻', archetype: 'Trailblazer', status: 'online', connected: true, expertise: ['Prompt Engineering', 'Productivity'] },
  { id: 'p2', name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator', status: 'online', connected: true, expertise: ['Automation', 'Data Analysis'] },
  { id: 'p3', name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide', status: 'away', lastSeen: '15 min ago', connected: true, expertise: ['AI Ethics', 'Prompt Engineering'] },
  { id: 'p4', name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide', status: 'online', connected: true, expertise: ['Content', 'Communication'] },
  { id: 'p5', name: 'James L.', avatar: '👨‍💼', archetype: 'Connector', status: 'offline', lastSeen: '2 hours ago', connected: true, expertise: ['Leadership', 'Strategy'] },
  { id: 'p6', name: 'Marcus Williams', avatar: '👨‍💻', archetype: 'Innovator', status: 'offline', lastSeen: '1 day ago', connected: true, expertise: ['Automation', 'Workflows'] },
  { id: 'p7', name: 'Jordan T.', avatar: '🏆', archetype: 'Champion', status: 'online', connected: false, expertise: ['Competition', 'Performance'] },
  { id: 'p8', name: 'Sophie Laurent', avatar: '👩‍🔬', archetype: 'Trailblazer', status: 'offline', lastSeen: '3 hours ago', connected: false, expertise: ['Data Analysis', 'Leadership'] },
  { id: 'p9', name: 'Ana P.', avatar: '👩‍🎨', archetype: 'Connector', status: 'away', lastSeen: '30 min ago', connected: false, expertise: ['HR', 'Communication'] },
];

const initialConversations: Conversation[] = [
  {
    peerId: 'p1', lastActivity: '2 min ago', unread: 2, pinned: true,
    messages: [
      { id: 'm1', senderId: 'p1', text: 'Hey! I saw your workflow post — that was really helpful!', time: '10:30 AM', status: 'read' },
      { id: 'm2', senderId: 'me', text: 'Thanks, Sarah! Glad it was useful. Have you tried the chain-of-thought approach?', time: '10:35 AM', status: 'read' },
      { id: 'm3', senderId: 'p1', text: 'Yes! I wrote about it in the forum. The step-by-step breakdown really improved my outputs by about 40%.', time: '10:42 AM', status: 'read' },
      { id: 'm4', senderId: 'me', text: 'That\'s amazing! Would love to compare notes sometime.', time: '10:45 AM', status: 'read' },
      { id: 'm5', senderId: 'p1', text: 'Absolutely! Are you free for a quick chat later today? I also wanted to discuss the automation challenge.', time: '11:20 AM', status: 'delivered' },
      { id: 'm6', senderId: 'p1', text: 'Also, have you seen the new prompt template that Mike shared? It\'s really good for data analysis tasks.', time: '11:22 AM', status: 'delivered' },
    ],
  },
  {
    peerId: 'p2', lastActivity: '1 hour ago', unread: 0,
    messages: [
      { id: 'm7', senderId: 'p2', text: 'Just automated my entire weekly report generation. Saved 3 hours!', time: 'Yesterday 3:15 PM', status: 'read' },
      { id: 'm8', senderId: 'me', text: 'Wow, that\'s incredible! Can you walk me through the setup?', time: 'Yesterday 3:20 PM', status: 'read' },
      { id: 'm9', senderId: 'p2', text: 'Sure! I\'ll post the detailed steps in the Workflow Automation forum. The key was chaining three prompts together.', time: 'Yesterday 3:30 PM', status: 'read' },
      { id: 'm10', senderId: 'me', text: 'Looking forward to it! I\'ll keep an eye out for the post.', time: 'Yesterday 3:35 PM', status: 'read' },
    ],
  },
  {
    peerId: 'p3', lastActivity: '3 hours ago', unread: 1,
    messages: [
      { id: 'm11', senderId: 'p3', text: 'Thank you for connecting! I noticed you\'re interested in prompt engineering.', time: 'Yesterday 9:00 AM', status: 'read' },
      { id: 'm12', senderId: 'me', text: 'Yes! Your office hour sessions are fantastic. Do you have any recommended reading?', time: 'Yesterday 9:15 AM', status: 'read' },
      { id: 'm13', senderId: 'p3', text: 'I\'d recommend starting with the "Prompt Engineering Guide" resource in the library. Also, my next office hours session covers advanced techniques — you should join!', time: 'Today 8:00 AM', status: 'delivered' },
    ],
  },
  {
    peerId: 'p4', lastActivity: 'Yesterday', unread: 0,
    messages: [
      { id: 'm14', senderId: 'me', text: 'Hi Priya! Your success story about content strategy was inspiring.', time: 'Monday 2:00 PM', status: 'read' },
      { id: 'm15', senderId: 'p4', text: 'Thank you so much! It\'s been a game-changer for our team. Happy to share more details if you\'re interested.', time: 'Monday 2:30 PM', status: 'read' },
    ],
  },
  {
    peerId: 'p5', lastActivity: '2 days ago', unread: 0,
    messages: [
      { id: 'm16', senderId: 'p5', text: 'Great to connect! Let me know if you need any help with the AI leadership module.', time: 'Sunday 11:00 AM', status: 'read' },
      { id: 'm17', senderId: 'me', text: 'Will do, James! Thanks for the offer.', time: 'Sunday 11:30 AM', status: 'read' },
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

export default function MessagesPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>('p1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedPeer = peers.find(p => p.id === selectedPeerId);
  const selectedConvo = conversations.find(c => c.peerId === selectedPeerId);

  const connectedPeers = peers.filter(p => p.connected);
  const suggestedPeers = peers.filter(p => !p.connected);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConvo?.messages.length, selectedPeerId]);

  useEffect(() => {
    if (selectedPeerId && inputRef.current) inputRef.current.focus();
  }, [selectedPeerId]);

  // Mark as read when selecting
  useEffect(() => {
    if (selectedPeerId) {
      setConversations(prev =>
        prev.map(c => c.peerId === selectedPeerId ? { ...c, unread: 0 } : c)
      );
    }
  }, [selectedPeerId]);

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
        return [
          { peerId: selectedPeerId, messages: [newMsg], lastActivity: 'Just now', unread: 0 },
          ...prev,
        ];
      }
    });
    setMessageInput('');

    // Simulate reply
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: selectedPeerId,
        text: getAutoReply(selectedPeerId),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setConversations(prev =>
        prev.map(c =>
          c.peerId === selectedPeerId
            ? { ...c, messages: [...c.messages, autoReply], lastActivity: 'Just now' }
            : c
        )
      );
    }, 1500 + Math.random() * 2000);
  };

  const connectWithPeer = (peerId: string) => {
    // In a real app this would be a backend call
    const peerIndex = peers.findIndex(p => p.id === peerId);
    if (peerIndex >= 0) {
      peers[peerIndex].connected = true;
    }
    setSelectedPeerId(peerId);
    setMobileView('chat');
    setShowSuggestions(false);
  };

  const getAutoReply = (peerId: string): string => {
    const replies: Record<string, string[]> = {
      p1: [
        'That sounds great! Let me check my schedule.',
        'Absolutely! I\'ll share my notes from the latest session.',
        'Good thinking! Want to collaborate on this?',
      ],
      p2: [
        'I\'ll put together a walkthrough for you!',
        'Great question — I\'ll test that out and report back.',
        'Let\'s set up a time to pair-program on this.',
      ],
      p3: [
        'Happy to help! Let me find the right resource for you.',
        'That\'s a great approach. I\'d suggest also considering the ethical implications.',
        'I\'ll cover that in my next office hours session!',
      ],
      p4: [
        'Thanks for reaching out! Let\'s discuss this further.',
        'I have some great examples I can share with you.',
        'That\'s exactly what we experienced on our team too!',
      ],
      p5: [
        'Great to hear from you! Let me think about that.',
        'I\'ll connect you with someone who specializes in that area.',
        'That aligns well with what I\'ve been working on.',
      ],
    };
    const peerReplies = replies[peerId] || ['Thanks for the message! Let me get back to you on that.'];
    return peerReplies[Math.floor(Math.random() * peerReplies.length)];
  };

  const filteredConversations = conversations.filter(c => {
    const peer = peers.find(p => p.id === c.peerId);
    if (!peer) return false;
    if (!searchQuery) return true;
    return peer.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }}>Messages</h1>
          <p style={{ fontSize: 16, color: '#5c5c5c', lineHeight: '24px' }}>
            Chat with your connected peers and grow together.
          </p>
        </div>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
          style={{
            backgroundColor: showSuggestions ? '#5236ab' : '#f2f1f9',
            color: showSuggestions ? '#ffffff' : '#5236ab',
            fontSize: 14, fontWeight: 600,
          }}
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Find Peers</span>
        </button>
      </div>

      {/* Suggested peers panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} style={{ color: '#5236ab' }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#151515', margin: 0 }}>
                  Suggested Connections
                </h3>
                <span style={{ fontSize: 12, color: '#767676' }}>Based on your archetype and interests</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {suggestedPeers.map(peer => (
                  <div
                    key={peer.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <div className="relative shrink-0">
                      <span className="text-2xl">{peer.avatar}</span>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: statusColors[peer.status] }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }} className="block truncate">{peer.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: archetypeColors[peer.archetype] }} />
                        <span style={{ fontSize: 11, color: '#767676' }}>{peer.archetype}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => connectWithPeer(peer.id)}
                      className="px-3 py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#5236ab', color: '#ffffff', fontSize: 12, fontWeight: 600 }}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat layout */}
      <div
        className="bg-white rounded-xl border border-gray-100 overflow-hidden flex"
        style={{
          boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
          height: 'calc(100vh - 280px)',
          minHeight: 400,
        }}
      >
        {/* Sidebar: Conversation list */}
        <div
          className={`shrink-0 border-r border-gray-100 flex flex-col w-full lg:w-80 ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
            }`}
        >
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg outline-none transition-colors"
                style={{
                  fontSize: 14, backgroundColor: '#f8f9fb', border: '1px solid #efefef',
                  fontFamily: 'var(--font-primary)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#5236ab')}
                onBlur={e => (e.currentTarget.style.borderColor = '#efefef')}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <MessageSquare size={32} style={{ color: '#cbc3e6' }} className="mb-3" />
                <p style={{ fontSize: 14, color: '#767676', textAlign: 'center' }}>
                  No conversations yet. Connect with peers to start chatting!
                </p>
              </div>
            ) : (
              filteredConversations
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map(convo => {
                  const peer = peers.find(p => p.id === convo.peerId);
                  if (!peer) return null;
                  const lastMsg = convo.messages[convo.messages.length - 1];
                  const isSelected = selectedPeerId === convo.peerId;
                  return (
                    <div
                      key={convo.peerId}
                      onClick={() => {
                        setSelectedPeerId(convo.peerId);
                        setMobileView('chat');
                      }}
                      className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-gray-50"
                      style={{
                        backgroundColor: isSelected ? '#f2f1f9' : 'transparent',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <span className="text-2xl">{peer.avatar}</span>
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: statusColors[peer.status] }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span style={{ fontSize: 14, fontWeight: convo.unread > 0 ? 700 : 500, color: '#151515' }} className="truncate">
                            {peer.name}
                          </span>
                          <span style={{ fontSize: 11, color: convo.unread > 0 ? '#5236ab' : '#a8a8a8', fontWeight: convo.unread > 0 ? 600 : 400 }} className="shrink-0">
                            {convo.lastActivity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p
                            style={{
                              fontSize: 13, lineHeight: '18px', margin: 0,
                              color: convo.unread > 0 ? '#333333' : '#a8a8a8',
                              fontWeight: convo.unread > 0 ? 500 : 400,
                            }}
                            className="truncate"
                          >
                            {lastMsg?.senderId === 'me' ? 'You: ' : ''}
                            {lastMsg?.text}
                          </p>
                          {convo.unread > 0 && (
                            <span
                              className="min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shrink-0"
                              style={{ backgroundColor: '#5236ab', color: '#fff', fontSize: 11, fontWeight: 700 }}
                            >
                              {convo.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Online count */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1ab977' }} />
              <span style={{ fontSize: 12, color: '#767676' }}>
                {connectedPeers.filter(p => p.status === 'online').length} peers online
              </span>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          {selectedPeer ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-1 cursor-pointer rounded hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="relative shrink-0">
                  <span className="text-xl">{selectedPeer.avatar}</span>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: statusColors[selectedPeer.status] }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#151515' }}>{selectedPeer.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: archetypeColors[selectedPeer.archetype] }} />
                    <span style={{ fontSize: 11, color: '#767676' }}>{selectedPeer.archetype}</span>
                  </div>
                  <span style={{ fontSize: 12, color: selectedPeer.status === 'online' ? '#1ab977' : '#a8a8a8' }}>
                    {selectedPeer.status === 'online' ? 'Online' : selectedPeer.status === 'away' ? `Away · ${selectedPeer.lastSeen}` : `Last seen ${selectedPeer.lastSeen}`}
                  </span>
                </div>
                {selectedPeer.expertise && (
                  <div className="hidden md:flex gap-1">
                    {selectedPeer.expertise.slice(0, 2).map(e => (
                      <span key={e} className="px-2 py-0.5 rounded-full" style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#f2f1f9', color: '#5236ab' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ backgroundColor: '#f8f9fb' }}>
                {selectedConvo?.messages.map((msg, i) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <span className="text-lg mr-2 mt-1 shrink-0">{selectedPeer.avatar}</span>
                      )}
                      <div
                        className="max-w-[70%] px-4 py-3 rounded-2xl"
                        style={{
                          backgroundColor: isMe ? '#5236ab' : '#ffffff',
                          color: isMe ? '#ffffff' : '#333333',
                          fontSize: 14,
                          lineHeight: '21px',
                          boxShadow: !isMe ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                          borderTopRightRadius: isMe ? 6 : 16,
                          borderTopLeftRadius: !isMe ? 6 : 16,
                        }}
                      >
                        {msg.text}
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.6)' : '#a8a8a8' }}>
                            {msg.time}
                          </span>
                          {isMe && (
                            msg.status === 'read' ? (
                              <CheckCheck size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            ) : (
                              <Check size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!selectedConvo && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f2f1f9' }}>
                      <MessageSquare size={28} style={{ color: '#5236ab' }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#151515' }}>Start a Conversation</p>
                    <p style={{ fontSize: 14, color: '#767676' }}>Say hello to {selectedPeer.name}!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 shrink-0" style={{ backgroundColor: '#ffffff' }}>
                <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" aria-label="Attach file">
                  <Paperclip size={18} className="text-gray-400" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${selectedPeer.name}...`}
                  className="flex-1 outline-none"
                  style={{
                    fontSize: 14, lineHeight: '20px', color: '#333333',
                    padding: '10px 14px', borderRadius: 12,
                    border: '1px solid #e6e3f3', backgroundColor: '#f8f9fb',
                    fontFamily: 'var(--font-primary)', transition: 'border-color 150ms',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#5236ab')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e6e3f3')}
                />
                <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" aria-label="Emoji">
                  <Smile size={18} className="text-gray-400" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all"
                  style={{
                    backgroundColor: messageInput.trim() ? '#5236ab' : '#e6e3f3',
                    color: messageInput.trim() ? '#ffffff' : '#a8a8a8',
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center" style={{ backgroundColor: '#f8f9fb' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f2f1f9' }}>
                <MessageSquare size={36} style={{ color: '#5236ab' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-2">Your Messages</h3>
              <p style={{ fontSize: 14, color: '#767676', maxWidth: 280, textAlign: 'center' }}>
                Select a conversation to start chatting, or connect with new peers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
