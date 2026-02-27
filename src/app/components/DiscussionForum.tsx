/**
 * ============================================
 * 💬 DISCUSSION FORUM COMPONENT — DiscussionForum.tsx
 * ============================================
 * 
 * This component handles the entire community forum logic. 
 * It switches between a "List View" (all topics) and a "Detail View" (one specific thread).
 * 
 * CORE FEATURES:
 * 1. Thread List: Displays summaries, likes, views, tags, and last active user.
 * 2. Thread Detail: Shows the full post and all nested replies with Chat action.
 * 3. Reply Logic: Allows users to type and "Post" a persistent local reply.
 * 4. Archetype Badges: Shows each commenter's specific archetype color.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, ThumbsUp, ChevronRight, ArrowLeft, Send, Clock,
  Pin, Eye, Reply, MoreHorizontal, Bookmark, Flag, Share2,
  MessageCircle,
} from 'lucide-react';

// --- Data Interfaces ---
interface ThreadReply {
  id: string;
  author: { name: string; avatar: string; archetype: string };
  content: string;
  time: string;
  likes: number;
}

interface ForumThread {
  id: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  title: string;
  content: string;
  author: { name: string; avatar: string; archetype: string };
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  pinned?: boolean;
  tags: string[];
  lastReply?: { name: string; avatar: string; time: string };
  threadReplies?: ThreadReply[];
}

// --- Mock Data ---
const forumThreads: ForumThread[] = [
  {
    id: 't1', category: 'Prompt Engineering', categoryIcon: '⚡', categoryColor: '#f59e0b', pinned: true,
    title: 'Best practices for chain-of-thought prompting in complex tasks',
    content: "I've been experimenting with chain-of-thought prompting for multi-step reasoning tasks and found some interesting patterns. When you break down the problem into smaller sub-tasks and explicitly ask the AI to \"think step by step,\" the accuracy improves significantly. Here's my approach: 1. Start with a clear problem statement 2. Ask the AI to identify the key components 3. Request step-by-step reasoning for each component 4. Synthesize the results. Has anyone else found similar patterns? I'd love to compare notes on what works best for different types of tasks.",
    author: { name: 'Sarah K.', avatar: '👩‍💻', archetype: 'Trailblazer' },
    createdAt: '2 hours ago', replies: 24, views: 342, likes: 56,
    tags: ['#prompts', '#techniques', '#best-practices'],
    lastReply: { name: 'Mike R.', avatar: '👨‍🔬', time: '10 min ago' },
    threadReplies: [
      {
        id: 'r1',
        author: { name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator' },
        content: "Great breakdown, Sarah! I've found that adding \"Let's think about this step by step\" as a prefix consistently improves outputs. For data analysis tasks specifically, I also add \"Show your reasoning for each calculation.\"",
        time: '1 hour ago', likes: 12,
      },
      {
        id: 'r2',
        author: { name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide' },
        content: "This is excellent advice. Research supports that explicit reasoning instructions improve accuracy by 30-40% on complex tasks. I'd also recommend using \"few-shot\" examples alongside chain-of-thought — showing the AI an example of the reasoning process you want.",
        time: '45 min ago', likes: 18,
      },
      {
        id: 'r3',
        author: { name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide' },
        content: "I tried this approach with customer response generation and it worked beautifully! The AI now considers context, tone, and specific customer needs before crafting a response. Thanks for sharing!",
        time: '30 min ago', likes: 8,
      },
      {
        id: 'r4',
        author: { name: 'James L.', avatar: '👨‍💼', archetype: 'Connector' },
        content: "Question: does this work equally well for creative tasks, or is it mainly beneficial for analytical/logical tasks? I've been trying to apply it to content creation but results are mixed.",
        time: '10 min ago', likes: 6,
      },
    ],
  },
  {
    id: 't2', category: 'Getting Started', categoryIcon: '🚀', categoryColor: '#14b8a6',
    title: 'My first week using AI at work — lessons learned',
    content: "Just completed my first full week integrating AI tools into my daily workflow. Here are the key takeaways and what I wish I knew from day one...",
    author: { name: 'Jordan T.', avatar: '🏆', archetype: 'Champion' },
    createdAt: '5 hours ago', replies: 18, views: 289, likes: 42,
    tags: ['#beginner', '#experience', '#tips'],
    lastReply: { name: 'Ana P.', avatar: '👩‍🎨', time: '1 hour ago' },
  },
  {
    id: 't3', category: 'Workflow Automation', categoryIcon: '✅', categoryColor: '#84cc16',
    title: "Automated my entire weekly reporting workflow — here's how",
    content: "Sharing my latest automation setup that replaced 4 hours of manual reporting every Friday...",
    author: { name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator' },
    createdAt: '1 day ago', replies: 31, views: 518, likes: 87,
    tags: ['#automation', '#workflow', '#reporting'],
    lastReply: { name: 'Sophie L.', avatar: '👩‍🔬', time: '2 hours ago' },
  },
  {
    id: 't4', category: 'Best Practices', categoryIcon: '✅', categoryColor: '#0ea5e9',
    title: 'How to handle sensitive data when using AI tools',
    content: "An important guide on data privacy and security measures when working with AI assistants in enterprise environments...",
    author: { name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide' },
    createdAt: '2 days ago', replies: 45, views: 721, likes: 112,
    tags: ['#security', '#ethics', '#data-privacy'],
    lastReply: { name: 'Sarah K.', avatar: '👩‍💻', time: '5 hours ago' },
  },
  {
    id: 't5', category: 'Feedback & Ideas', categoryIcon: '💡', categoryColor: '#f59e0b',
    title: 'Feature request: AI-powered study groups matching',
    content: "What if the platform could match us with study partners based on our learning goals, archetype, and availability?",
    author: { name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide' },
    createdAt: '3 days ago', replies: 22, views: 198, likes: 63,
    tags: ['#feature-request', '#community', '#matching'],
    lastReply: { name: 'Jordan T.', avatar: '🏆', time: '8 hours ago' },
  },
];

const archetypeColors: Record<string, string> = {
  Trailblazer: '#f59e0b', Guide: '#14b8a6', Connector: '#8b5cf6',
  Explorer: '#0ea5e9', Champion: '#e31937', Innovator: '#84cc16',
};

export function DiscussionForum({ onSuggestChat }: { onSuggestChat?: (name: string) => void }) {
  // -- Local State --
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<Record<string, ThreadReply[]>>({});

  // -- Actions --
  const handlePostReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    const newReply: ThreadReply = {
      id: `new-${Date.now()}`,
      author: { name: 'You', avatar: '🙋', archetype: 'Trailblazer' },
      content: replyText.trim(),
      time: 'Just now',
      likes: 0,
    };
    setLocalReplies(prev => ({
      ...prev, [selectedThread.id]: [...(prev[selectedThread.id] || []), newReply]
    }));
    setReplyText('');
  };

  // ============================================
  // VIEW: THREAD DETAIL (When a topic is opened)
  // ============================================
  if (selectedThread) {
    const allReplies = [...(selectedThread.threadReplies || []), ...(localReplies[selectedThread.id] || [])];

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
        {/* Navigation Head */}
        <button onClick={() => setSelectedThread(null)} className="flex items-center gap-2 mb-5 font-semibold cursor-pointer transition-colors" style={{ color: 'var(--app-text-secondary)', fontSize: 14 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#5236ab')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--app-text-secondary)')}
        >
          <ArrowLeft size={16} /> Back to Discussions
        </button>

        {/* The Main Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
        >
          {/* Category + Pinned badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${selectedThread.categoryColor || '#5236ab'}15`, color: selectedThread.categoryColor || '#5236ab' }}>
              {selectedThread.categoryIcon} {selectedThread.category}
            </span>
            {selectedThread.pinned && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                📌 Pinned
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--app-text-primary)', lineHeight: 1.4 }}>{selectedThread.title}</h2>

          {/* Author info with Chat action */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedThread.author.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: 'var(--app-text-primary)' }}>{selectedThread.author.name}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: archetypeColors[selectedThread.author.archetype] || '#5236ab' }} />
                  <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>{selectedThread.author.archetype}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--app-text-hint)' }}>{selectedThread.createdAt}</div>
              </div>
            </div>
            <button
              onClick={() => onSuggestChat?.(selectedThread.author.name)}
              className="text-xs font-semibold cursor-pointer transition-colors px-3 py-1.5 rounded-lg"
              style={{ color: '#5236ab', backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--app-brand-light)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Message
            </button>
          </div>

          <p style={{ color: 'var(--app-text-secondary)', lineHeight: '1.75', fontSize: 14 }}>{selectedThread.content}</p>

          {/* Tags */}
          {selectedThread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5" style={{ borderTop: '1px solid var(--app-border)' }}>
              {selectedThread.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--app-brand-light)'; e.currentTarget.style.color = '#5236ab'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--app-tab-bg)'; e.currentTarget.style.color = 'var(--app-text-secondary)'; }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats bar */}
          <div className="flex items-center gap-5 mt-5 pt-4" style={{ borderTop: '1px solid var(--app-border)' }}>
            <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>
              <ThumbsUp size={14} /> {selectedThread.likes}
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>
              <Eye size={14} /> {selectedThread.views}
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>
              <MessageSquare size={14} /> {allReplies.length} replies
            </span>
            <div className="flex-1" />
            <Bookmark size={16} style={{ color: 'var(--app-text-hint)', cursor: 'pointer' }} />
          </div>
        </motion.div>

        {/* Discussion Feed (Replies) */}
        <h3 className="font-bold mb-5" style={{ color: 'var(--app-text-primary)', fontSize: 16 }}>Replies ({allReplies.length})</h3>
        <div className="space-y-4 mb-6">
          {allReplies.map((reply, idx) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
              className="p-5 rounded-xl"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{reply.author.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--app-text-primary)' }}>{reply.author.name}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: archetypeColors[reply.author.archetype] || '#5236ab' }} />
                      <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>{reply.author.archetype}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--app-text-hint)' }}>{reply.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => onSuggestChat?.(reply.author.name)}
                  className="text-xs font-semibold cursor-pointer transition-colors px-3 py-1.5 rounded-lg"
                  style={{ color: '#5236ab', backgroundColor: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--app-brand-light)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Chat
                </button>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.7 }}>{reply.content}</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                  <ThumbsUp size={12} /> {reply.likes}
                </span>
                <span className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                  <Reply size={12} /> Reply
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fast Reply Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-xl"
          style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
        >
          <textarea
            value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-3 rounded-lg outline-none text-sm resize-none"
            style={{ backgroundColor: 'var(--app-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)', lineHeight: 1.6 }}
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePostReply}
              disabled={!replyText.trim()}
              className="text-white px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer flex items-center gap-2 transition-all"
              style={{
                backgroundColor: replyText.trim() ? '#5236ab' : 'var(--app-tab-bg)',
                color: replyText.trim() ? 'white' : 'var(--app-text-hint)',
                opacity: replyText.trim() ? 1 : 0.6,
              }}
            >
              <Send size={14} /> Post Reply
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ============================================
  // VIEW: THREAD LIST (Main Forum Landing)
  // ============================================
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: 'var(--app-text-primary)' }}>Recent Discussions</h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2"
          style={{ backgroundColor: '#1a1a2e' }}
        >
          + New Discussion
        </motion.button>
      </div>

      <div className="space-y-4">
        {forumThreads.map((thread, i) => (
          <motion.div
            key={thread.id}
            onClick={() => setSelectedThread(thread)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            className="p-5 rounded-xl cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
          >
            {/* Top row: avatar, category, pinned, arrow */}
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1">{thread.author.avatar}</span>
              <div className="flex-1 min-w-0">
                {/* Category & Pinned Badges */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${thread.categoryColor}15`, color: thread.categoryColor }}
                  >
                    {thread.categoryIcon} {thread.category}
                  </span>
                  {thread.pinned && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                      style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                    >
                      📌 Pinned
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold mb-1" style={{ color: 'var(--app-text-primary)', fontSize: 15, lineHeight: 1.4 }}>{thread.title}</h4>

                {/* Author & time */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>{thread.author.name}</span>
                  <span style={{ color: 'var(--app-text-hint)', fontSize: 11 }}>·</span>
                  <span className="text-xs" style={{ color: 'var(--app-text-hint)' }}>{thread.createdAt}</span>
                </div>

                {/* Stats + Tags + Last reply */}
                <div className="flex items-center justify-between flex-wrap gap-y-2">
                  <div className="flex items-center gap-4">
                    {/* Engagement stats */}
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>
                      <ThumbsUp size={12} /> {thread.likes}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>
                      <MessageSquare size={12} /> {thread.replies}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>
                      <Eye size={12} /> {thread.views}
                    </span>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 ml-2">
                      {thread.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-xs"
                          style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-muted)', fontSize: 11 }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Last reply info */}
                  {thread.lastReply && (
                    <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--app-text-hint)' }}>
                      Last reply by <span className="text-sm">{thread.lastReply.avatar}</span>
                      <span style={{ fontWeight: 500, color: 'var(--app-text-muted)' }}>{thread.lastReply.name}</span>
                      <span>· {thread.lastReply.time}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={18} style={{ color: 'var(--app-text-hint)', marginTop: 4, flexShrink: 0 }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
