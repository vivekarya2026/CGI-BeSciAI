import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, ThumbsUp, ChevronRight, ArrowLeft, Send, Clock,
  Pin, Eye, Reply, MoreHorizontal, Bookmark, Flag, Share2,
} from 'lucide-react';

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
  lastReply?: { name: string; avatar: string; time: string };
  threadReplies?: ThreadReply[];
}

interface ThreadReply {
  id: string;
  author: { name: string; avatar: string; archetype: string };
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

const forumThreads: ForumThread[] = [
  {
    id: 't1', category: 'Prompt Engineering', categoryIcon: '⚡', pinned: true,
    title: 'Best practices for chain-of-thought prompting in complex tasks',
    content: 'I\'ve been experimenting with chain-of-thought prompting for multi-step reasoning tasks and found some interesting patterns. When you break down the problem into smaller sub-tasks and explicitly ask the AI to "think step by step," the accuracy improves significantly.\n\nHere\'s my approach:\n1. Start with a clear problem statement\n2. Ask the AI to identify the key components\n3. Request step-by-step reasoning for each component\n4. Synthesize the results\n\nHas anyone else found similar patterns? I\'d love to compare notes on what works best for different types of tasks.',
    author: { name: 'Sarah K.', avatar: '👩‍💻', archetype: 'Trailblazer' },
    createdAt: '2 hours ago', replies: 24, views: 342, likes: 56,
    tags: ['prompts', 'techniques', 'best-practices'],
    lastReply: { name: 'Mike R.', avatar: '👨‍🔬', time: '10 min ago' },
    threadReplies: [
      {
        id: 'r1',
        author: { name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator' },
        content: 'Great breakdown, Sarah! I\'ve found that adding "Let\'s think about this step by step" as a prefix consistently improves outputs. For data analysis tasks specifically, I also add "Show your reasoning for each calculation."',
        time: '1 hour ago', likes: 12,
      },
      {
        id: 'r2',
        author: { name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide' },
        content: 'This is excellent advice. Research supports that explicit reasoning instructions improve accuracy by 30-40% on complex tasks. I\'d also recommend using "few-shot" examples alongside chain-of-thought — showing the AI an example of the reasoning process you want.',
        time: '45 min ago', likes: 18,
      },
      {
        id: 'r3',
        author: { name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide' },
        content: 'I tried this approach with customer response generation and it worked beautifully! The AI now considers context, tone, and specific customer needs before crafting a response. Thanks for sharing!',
        time: '30 min ago', likes: 8,
      },
      {
        id: 'r4',
        author: { name: 'James L.', avatar: '👨‍💼', archetype: 'Connector' },
        content: 'Question: does this work equally well for creative tasks, or is it mainly beneficial for analytical/logical tasks? I\'ve been trying to apply it to content creation but results are mixed.',
        time: '10 min ago', likes: 5,
      },
    ],
  },
  {
    id: 't2', category: 'Getting Started', categoryIcon: '🌱',
    title: 'My first week using AI at work — lessons learned',
    content: 'Just completed my first week integrating AI tools into my daily workflow. Here are the key takeaways...',
    author: { name: 'Jordan T.', avatar: '🏆', archetype: 'Champion' },
    createdAt: '5 hours ago', replies: 18, views: 289, likes: 42,
    tags: ['beginner', 'experience', 'tips'],
    lastReply: { name: 'Ana P.', avatar: '👩‍🎨', time: '1 hour ago' },
    threadReplies: [
      {
        id: 'r5',
        author: { name: 'Ana P.', avatar: '👩‍🎨', archetype: 'Connector' },
        content: 'Welcome to the AI journey, Jordan! My biggest tip: start small. Pick ONE task you do daily and try AI for that. Don\'t try to change everything at once.',
        time: '3 hours ago', likes: 9,
      },
      {
        id: 'r6',
        author: { name: 'Marcus Williams', avatar: '👨‍💻', archetype: 'Innovator' },
        content: 'Great start! One thing I wish someone told me early on — save your best prompts. Build a personal prompt library. Future you will thank present you!',
        time: '1 hour ago', likes: 14,
      },
    ],
  },
  {
    id: 't3', category: 'Workflow Automation', categoryIcon: '🔄',
    title: 'Automated my entire weekly reporting workflow — here\'s how',
    content: 'Sharing my workflow for automating weekly reports using AI...',
    author: { name: 'Mike R.', avatar: '👨‍🔬', archetype: 'Innovator' },
    createdAt: '1 day ago', replies: 31, views: 518, likes: 87,
    tags: ['automation', 'workflow', 'reporting'],
    lastReply: { name: 'Sophie L.', avatar: '👩‍🔬', time: '2 hours ago' },
    threadReplies: [
      {
        id: 'r7',
        author: { name: 'Sophie L.', avatar: '👩‍🔬', archetype: 'Trailblazer' },
        content: 'This is amazing, Mike! How long did it take to set up the first time? I\'m concerned about the initial time investment.',
        time: '4 hours ago', likes: 6,
      },
    ],
  },
  {
    id: 't4', category: 'Best Practices', categoryIcon: '✅',
    title: 'How to handle sensitive data when using AI tools',
    content: 'An important topic we need to discuss — data privacy and AI...',
    author: { name: 'Dr. Emily Chen', avatar: '👩‍🏫', archetype: 'Guide' },
    createdAt: '2 days ago', replies: 45, views: 721, likes: 112,
    tags: ['security', 'ethics', 'data-privacy'],
    lastReply: { name: 'Sarah K.', avatar: '👩‍💻', time: '5 hours ago' },
    threadReplies: [],
  },
  {
    id: 't5', category: 'Feedback & Ideas', categoryIcon: '💡',
    title: 'Feature request: AI-powered study groups matching',
    content: 'Wouldn\'t it be great if the platform could match us with study partners based on our archetypes and interests?',
    author: { name: 'Priya S.', avatar: '👩‍🎨', archetype: 'Guide' },
    createdAt: '3 days ago', replies: 22, views: 198, likes: 63,
    tags: ['feature-request', 'community', 'matching'],
    lastReply: { name: 'Jordan T.', avatar: '🏆', time: '8 hours ago' },
    threadReplies: [],
  },
];

const archetypeColors: Record<string, string> = {
  Trailblazer: '#f59e0b', Guide: '#14b8a6', Connector: '#8b5cf6',
  Explorer: '#0ea5e9', Champion: '#e31937', Innovator: '#84cc16',
};

interface DiscussionForumProps {
  onSuggestChat?: (userName: string) => void;
}

export function DiscussionForum({ onSuggestChat }: DiscussionForumProps) {
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');
  const [threadLikes, setThreadLikes] = useState<Record<string, boolean>>({});
  const [replyLikes, setReplyLikes] = useState<Record<string, boolean>>({});
  const [localReplies, setLocalReplies] = useState<Record<string, ThreadReply[]>>({});

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
      ...prev,
      [selectedThread.id]: [...(prev[selectedThread.id] || []), newReply],
    }));
    setReplyText('');
  };

  const getAllReplies = (thread: ForumThread): ThreadReply[] => {
    return [...(thread.threadReplies || []), ...(localReplies[thread.id] || [])];
  };

  // Thread detail view
  if (selectedThread) {
    const allReplies = getAllReplies(selectedThread);
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Back */}
        <button
          onClick={() => setSelectedThread(null)}
          className="flex items-center gap-2 mb-5 cursor-pointer transition-colors hover:text-[#5236ab]"
          style={{ fontSize: 14, fontWeight: 600, color: '#5c5c5c' }}
        >
          <ArrowLeft size={16} /> Back to Discussions
        </button>

        {/* Thread */}
        <div
          className="bg-white rounded-xl border border-gray-100 p-6 mb-6"
          style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
        >
          {/* Category & tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f2f1f9', fontSize: 12, fontWeight: 600, color: '#5236ab' }}>
              {selectedThread.categoryIcon} {selectedThread.category}
            </span>
            {selectedThread.pinned && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#fef3c7', fontSize: 12, fontWeight: 600, color: '#92400e' }}>
                <Pin size={11} /> Pinned
              </span>
            )}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#151515', lineHeight: '1.3', margin: '0 0 16px' }}>
            {selectedThread.title}
          </h2>

          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{selectedThread.author.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{selectedThread.author.name}</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: archetypeColors[selectedThread.author.archetype] }} />
                  <span style={{ fontSize: 11, color: '#767676' }}>{selectedThread.author.archetype}</span>
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#a8a8a8' }}>{selectedThread.createdAt}</span>
            </div>
            {onSuggestChat && selectedThread.author.name !== 'You' && (
              <button
                onClick={() => onSuggestChat(selectedThread.author.name)}
                className="ml-auto px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[#f2f1f9]"
                style={{ fontSize: 12, fontWeight: 600, color: '#5236ab', border: '1px solid #e6e3f3' }}
              >
                Message
              </button>
            )}
          </div>

          {/* Content */}
          <div style={{ fontSize: 16, lineHeight: '26px', color: '#333333', whiteSpace: 'pre-line' }}>
            {selectedThread.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {selectedThread.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full" style={{ backgroundColor: '#efefef', fontSize: 12, color: '#5c5c5c' }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions bar */}
          <div className="flex items-center gap-5 mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => setThreadLikes(prev => ({ ...prev, [selectedThread.id]: !prev[selectedThread.id] }))}
              className="flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{
                fontSize: 13, fontWeight: 600,
                color: threadLikes[selectedThread.id] ? '#5236ab' : '#767676',
              }}
            >
              <ThumbsUp size={15} fill={threadLikes[selectedThread.id] ? '#5236ab' : 'none'} />
              {selectedThread.likes + (threadLikes[selectedThread.id] ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: '#767676' }}>
              <Eye size={15} /> {selectedThread.views}
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: '#767676' }}>
              <Reply size={15} /> {allReplies.length} replies
            </span>
            <button className="flex items-center gap-1.5 cursor-pointer ml-auto" style={{ fontSize: 13, color: '#767676' }}>
              <Bookmark size={15} />
            </button>
            <button className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 13, color: '#767676' }}>
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Replies */}
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515' }} className="mb-4">
          Replies ({allReplies.length})
        </h3>

        <div className="space-y-4 mb-6">
          {allReplies.map((reply, i) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-5 border border-gray-100"
              style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{reply.author.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{reply.author.name}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: archetypeColors[reply.author.archetype] || '#5236ab' }} />
                      <span style={{ fontSize: 11, color: '#767676' }}>{reply.author.archetype}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#a8a8a8' }}>{reply.time}</span>
                </div>
                {onSuggestChat && reply.author.name !== 'You' && (
                  <button
                    onClick={() => onSuggestChat(reply.author.name)}
                    className="px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[#f2f1f9]"
                    style={{ fontSize: 12, fontWeight: 600, color: '#5236ab', border: '1px solid #e6e3f3' }}
                  >
                    Chat
                  </button>
                )}
              </div>
              <p style={{ fontSize: 15, lineHeight: '24px', color: '#333333', margin: 0 }}>
                {reply.content}
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                <button
                  onClick={() => setReplyLikes(prev => ({ ...prev, [reply.id]: !prev[reply.id] }))}
                  className="flex items-center gap-1 cursor-pointer transition-colors"
                  style={{
                    fontSize: 12, fontWeight: 600,
                    color: replyLikes[reply.id] ? '#5236ab' : '#a8a8a8',
                  }}
                >
                  <ThumbsUp size={13} fill={replyLikes[reply.id] ? '#5236ab' : 'none'} />
                  {reply.likes + (replyLikes[reply.id] ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1 cursor-pointer" style={{ fontSize: 12, color: '#a8a8a8' }}>
                  <Reply size={13} /> Reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply input */}
        <div
          className="bg-white rounded-xl border border-gray-100 p-4"
          style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
        >
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full resize-none outline-none"
            style={{
              fontSize: 15, lineHeight: '22px', color: '#333333',
              border: '1px solid #e6e3f3', borderRadius: 10, padding: '12px 16px',
              backgroundColor: '#f8f9fb', fontFamily: 'var(--font-primary)',
              transition: 'border-color 150ms',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#5236ab')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e6e3f3')}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePostReply}
              disabled={!replyText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white cursor-pointer transition-opacity"
              style={{
                backgroundColor: replyText.trim() ? '#5236ab' : '#cbc3e6',
                fontSize: 14, fontWeight: 600,
              }}
            >
              <Send size={14} /> Post Reply
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Thread list view
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Recent Discussions</h2>
        <button
          className="px-5 py-2.5 rounded-lg text-white cursor-pointer font-semibold"
          style={{ backgroundColor: '#5236ab', fontSize: 14 }}
        >
          + New Discussion
        </button>
      </div>

      <div className="space-y-3">
        {forumThreads.map((thread, i) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedThread(thread)}
            className="bg-white rounded-xl p-5 border border-gray-100 cursor-pointer transition-all"
            style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1 shrink-0">{thread.author.avatar}</span>
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#f2f1f9', color: '#5236ab' }}>
                    {thread.categoryIcon} {thread.category}
                  </span>
                  {thread.pinned && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e' }}>
                      <Pin size={10} /> Pinned
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#151515', lineHeight: '22px', margin: '4px 0 6px' }}>
                  {thread.title}
                </h4>

                {/* Author & meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontSize: 13, color: '#5c5c5c' }}>
                    <span className="font-semibold">{thread.author.name}</span>
                    <span className="mx-1">·</span>
                    {thread.createdAt}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                    <ThumbsUp size={12} /> {thread.likes}
                  </span>
                  <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                    <MessageSquare size={12} /> {thread.replies}
                  </span>
                  <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                    <Eye size={12} /> {thread.views}
                  </span>
                  {thread.lastReply && (
                    <span className="flex items-center gap-1 ml-auto" style={{ fontSize: 12, color: '#a8a8a8' }}>
                      Last reply by {thread.lastReply.avatar} <span className="font-medium">{thread.lastReply.name}</span> · {thread.lastReply.time}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {thread.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f3f4f6', fontSize: 11, color: '#767676' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight size={18} className="text-gray-300 shrink-0 mt-3" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
