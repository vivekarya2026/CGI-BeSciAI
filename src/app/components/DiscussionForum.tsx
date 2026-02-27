/**
 * ============================================
 * 💬 DISCUSSION FORUM COMPONENT — DiscussionForum.tsx
 * ============================================
 * 
 * This component handles the entire community forum logic. 
 * It switches between a "List View" (all topics) and a "Detail View" (one specific thread).
 * 
 * CORE FEATURES:
 * 1. Thread List: Displays summaries, likes, views, and last active user.
 * 2. Thread Detail: Shows the full post and all nested replies.
 * 3. Reply Logic: Allows users to type and "Post" a persistent local reply.
 * 4. Archetype Badges: Shows each commenter's specific archetype color.
 * 
 * HINT FOR BEGINNERS:
 * We use a state variable called `selectedThread`. 
 * If it's `null`, we show the list. If it has a thread object, 
 * we "conditionally render" the detailed discussion view!
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, ThumbsUp, ChevronRight, ArrowLeft, Send, Clock,
  Pin, Eye, Reply, MoreHorizontal, Bookmark, Flag, Share2,
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
  title: string;
  content: string;
  author: { name: string; avatar: string; archetype: string };
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  pinned?: boolean;
  tags: string[];
  threadReplies?: ThreadReply[];
}

// --- Mock Data ---
const forumThreads: ForumThread[] = [
  {
    id: 't1', category: 'Prompt Engineering', categoryIcon: '⚡', pinned: true,
    title: 'Best practices for chain-of-thought prompting',
    content: 'I\'ve found that breaking down problems into steps improves accuracy significantly...',
    author: { name: 'Sarah K.', avatar: '👩‍💻', archetype: 'Trailblazer' },
    createdAt: '2 hours ago', replies: 24, views: 342, likes: 56,
    tags: ['prompts', 'techniques'],
    threadReplies: [
      { id: 'r1', author: { name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator' }, content: 'Great breakdown! I completely agree.', time: '1 hour ago', likes: 12 },
    ],
  },
  {
    id: 't2', category: 'Workflow Automation', categoryIcon: '🔄',
    title: 'How I automate my email triage',
    content: 'Sharing my latest automation script for sorting 100+ emails every morning...',
    author: { name: 'James L.', avatar: '👨‍💼', archetype: 'Connector' },
    createdAt: '5 hours ago', replies: 12, views: 180, likes: 29,
    tags: ['email', 'productivity'],
  }
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
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        {/* Navigation Head */}
        <button onClick={() => setSelectedThread(null)} className="flex items-center gap-2 mb-4 text-[#5c5c5c] font-bold cursor-pointer">
          <ArrowLeft size={16} /> Back to List
        </button>

        {/* The Main Post Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <span className="text-xs font-bold px-2 py-1 rounded bg-purple-50 text-[#5236ab] mb-2 inline-block">
            {selectedThread.categoryIcon} {selectedThread.category}
          </span>
          <h2 className="text-xl font-bold mb-4">{selectedThread.title}</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{selectedThread.author.avatar}</span>
            <div>
              <div className="font-bold text-sm">{selectedThread.author.name}</div>
              <div className="text-xs text-gray-400">{selectedThread.createdAt}</div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{selectedThread.content}</p>
        </div>

        {/* Discussion Feed (Replies) */}
        <h3 className="font-bold mb-4">Discussion ({allReplies.length})</h3>
        <div className="space-y-4 mb-6">
          {allReplies.map(reply => (
            <div key={reply.id} className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{reply.author.avatar}</span>
                <span className="font-bold text-sm">{reply.author.name}</span>
                <span className="text-[10px] text-gray-400">{reply.time}</span>
              </div>
              <p className="text-sm text-gray-600">{reply.content}</p>
            </div>
          ))}
        </div>

        {/* Fast Reply Box */}
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <textarea
            value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder="Write a helpful reply..."
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-[#5236ab] text-sm"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button onClick={handlePostReply} disabled={!replyText.trim()} className="bg-[#5236ab] text-white px-4 py-2 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-30">
              Post Reply
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // VIEW: THREAD LIST (Main Forum Landing)
  // ============================================
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Community Feed</h2>
        <button className="bg-[#5236ab] text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer">+ New Topic</button>
      </div>

      {forumThreads.map(thread => (
        <motion.div
          key={thread.id} onClick={() => setSelectedThread(thread)}
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400">{thread.category}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">{thread.title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{thread.author.avatar}</span>
              <span className="text-xs font-semibold">{thread.author.name}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <span className="flex items-center gap-1"><ThumbsUp size={12} /> {thread.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={12} /> {thread.replies}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
