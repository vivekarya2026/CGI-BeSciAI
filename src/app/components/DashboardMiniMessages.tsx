import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  CheckCheck,
} from 'lucide-react';
import clsx from 'clsx';
import { ARCHETYPE_COLORS as archetypeColors, STATUS_COLORS as statusColors } from '../lib/colors';

type MiniMessageStatus = 'sent' | 'delivered' | 'read';

interface MiniMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  time: string;
  status: MiniMessageStatus;
}

interface MiniConversation {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastActivity: string;
  unread: number;
  archetype: string;
  messages: MiniMessage[];
}


const MINI_CONVERSATIONS: MiniConversation[] = [
  {
    id: 'c1',
    name: 'Sarah K.',
    avatar: '👩‍💻',
    status: 'online',
    lastActivity: '2 min ago',
    unread: 0,
    archetype: 'Trailblazer',
    messages: [
      {
        id: 'm1',
        sender: 'peer',
        text: 'Hey! I saw your workflow post — that was really helpful!',
        time: '10:30',
        status: 'read',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Thanks, Sarah! Glad it was useful. Have you tried the chain-of-thought approach?',
        time: '10:35',
        status: 'read',
      },
      {
        id: 'm3',
        sender: 'peer',
        text: 'Yes! It boosted my outputs by ~40%.',
        time: '10:42',
        status: 'read',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Mike R.',
    avatar: '👨‍🔬',
    status: 'online',
    lastActivity: '1 hour ago',
    unread: 0,
    archetype: 'Innovator',
    messages: [
      {
        id: 'm4',
        sender: 'peer',
        text: 'Just automated my weekly report — saved 3 hours.',
        time: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm5',
        sender: 'me',
        text: 'Amazing. Send me the prompt setup when you can?',
        time: 'Yesterday',
        status: 'read',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Dr. Emily Chen',
    avatar: '👩‍🏫',
    status: 'away',
    lastActivity: '3 hours ago',
    unread: 1,
    archetype: 'Guide',
    messages: [
      {
        id: 'm6',
        sender: 'me',
        text: 'Any tips on data anonymization for our next pilot?',
        time: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm7',
        sender: 'peer',
        text: 'Start with the \"Prompt Engineering\" module — great for safe data handling.',
        time: '3 hours ago',
        status: 'delivered',
      },
    ],
  },
];

interface DashboardMiniMessagesProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullMessages: () => void;
}

export function DashboardMiniMessages({
  isOpen,
  onClose,
  onOpenFullMessages,
}: DashboardMiniMessagesProps) {
  const [conversations, setConversations] = useState<MiniConversation[]>(MINI_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>('c1');
  const [input, setInput] = useState('');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find(c => c.id === selectedId) || conversations[0],
    [conversations, selectedId],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages.length, selectedId]);

  const handleSend = () => {
    if (!input.trim() || !selectedConversation) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: MiniMessage = {
      id: `mini-${Date.now()}`,
      sender: 'me',
      text: input.trim(),
      time,
      status: 'sent',
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation.id
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastActivity: 'Just now',
              unread: 0,
            }
          : c,
      ),
    );
    setInput('');

    // Lightweight simulated reply to keep it lively
    setTimeout(() => {
      const autoReply: MiniMessage = {
        id: `mini-reply-${Date.now()}`,
        sender: 'peer',
        text: 'Sounds great! Let’s compare notes later today.',
        time,
        status: 'read',
      };
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id
            ? {
                ...c,
                messages: [...c.messages, autoReply],
                lastActivity: 'Just now',
              }
            : c,
        ),
      );
    }, 1500);
  };

  const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mini-messages-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={handleBackgroundClick}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Mini messages"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mini-messages-panel"
          >
            {/* Header */}
            <div className="mini-messages-header">
              <div className="mini-messages-header-left">
                <div className="mini-messages-avatar">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="mini-messages-title">Messages</div>
                  <div className="mini-messages-subtitle">
                    Quick chats with your peers
                  </div>
                </div>
              </div>
              <div className="mini-messages-header-actions">
                <button
                  type="button"
                  className="mini-messages-link"
                  onClick={onOpenFullMessages}
                >
                  Open full
                </button>
                <button
                  type="button"
                  className="mini-messages-icon-button"
                  onClick={onClose}
                  aria-label="Close mini messages"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="mini-messages-body">
              {/* Conversation list */}
              <div className="mini-conversation-list">
                {conversations.map(convo => {
                  const isSelected = selectedConversation?.id === convo.id;
                  return (
                    <button
                      key={convo.id}
                      type="button"
                      onClick={() => setSelectedId(convo.id)}
                      className={clsx('mini-conversation-item', {
                        'mini-conversation-item-selected': isSelected,
                      })}
                    >
                      <div className="peer-avatar">
                        <span className="text-base">{convo.avatar}</span>
                        <span
                          className="status-dot"
                          style={{ backgroundColor: statusColors[convo.status] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="mini-conversation-name">
                            {convo.name}
                          </span>
                          <span className="mini-conversation-time">
                            {convo.lastActivity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className="archetype-dot"
                            style={{ backgroundColor: archetypeColors[convo.archetype] || 'var(--purple-400)' }}
                          />
                          <span className="mini-conversation-preview">
                            {convo.messages[convo.messages.length - 1]?.text}
                          </span>
                        </div>
                      </div>
                      {convo.unread > 0 && (
                        <span className="unread-badge">
                          {convo.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Thread */}
              <div className="mini-thread">
                <div className="mini-thread-messages">
                  {selectedConversation?.messages.map(msg => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={clsx('mini-message-row', {
                          'mini-message-row-me': isMe,
                          'mini-message-row-peer': !isMe,
                        })}
                      >
                        {!isMe && (
                          <span className="mini-message-avatar">
                            {selectedConversation.avatar}
                          </span>
                        )}
                        <div
                          className={clsx({
                            'message-bubble-sent': isMe,
                            'message-bubble-received': !isMe,
                          })}
                        >
                          {msg.text}
                          <div
                            className="mini-message-meta"
                            style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}
                          >
                            <span className="message-time">
                              {msg.time}
                            </span>
                            {isMe && (
                              <CheckCheck
                                size={12}
                                style={{
                                  opacity: 0.7,
                                  color: msg.status === 'read'
                                    ? '#a5d6ff'
                                    : 'rgba(255,255,255,0.5)',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="mini-message-input-bar">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    placeholder={selectedConversation
                      ? `Message ${selectedConversation.name}...`
                      : 'Type a message...'}
                    className="mini-message-input"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={clsx('mini-message-send-button', {
                      'mini-message-send-button-active': input.trim(),
                    })}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

