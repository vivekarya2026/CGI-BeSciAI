/**
 * ============================================
 * 👥 COMMUNITY PAGE — CommunityPage.tsx
 * ============================================
 * 
 * This page is where users connect with each other. 
 * High engagement and social proof are key here!
 * 
 * 🗺️ SUB-TABS:
 * 1. Peer Progress: See trending workflows and the weekly leaderboard.
 * 2. Success Stories: Real-world examples of how AI helped other people.
 * 3. Discussion Forums: A place for Q&A and sharing tips (uses DiscussionForum component).
 * 4. Champions Network: Connect with senior experts and join office hours.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Users, BookOpen, MessageSquare, Crown, Heart, TrendingUp,
  MessageCircle, Star, Calendar, Clock, ArrowRight, Filter,
  ChevronUp, ChevronDown, Award, Flame, UserPlus, Minus,
  Eye, ThumbsUp,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { archetypes } from '../../data/archetypes';
import { DiscussionForum } from '../../components/DiscussionForum';

// Defining the sub-tabs for the page
type SubTab = 'peers' | 'stories' | 'forums' | 'champions';

// Stagger animation config
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
};

export default function CommunityPage() {
  const { archetype } = useUser();
  const navigate = useNavigate();

  // -- Local Page State --
  const [activeTab, setActiveTab] = useState<SubTab>('peers');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Definitions for the navigation menu buttons
  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'peers', label: 'Peer Progress', icon: <Users size={16} /> },
    { id: 'stories', label: 'Success Stories', icon: <BookOpen size={16} /> },
    { id: 'forums', label: 'Discussion Forums', icon: <MessageSquare size={16} /> },
    { id: 'champions', label: 'Champions Network', icon: <Crown size={16} /> },
  ];

  // Helper: Gets the brand color for a specific archetype
  const getArchetypeColor = (name: string) => {
    const key = name.toLowerCase();
    return archetypes[key]?.color || '#5236ab';
  };

  // ============================================
  // MOCK DATA (For visualization)
  // ============================================
  const trendingWorkflows = [
    { id: 1, title: 'Email Triage Automation', creator: 'Sarah K.', avatar: '👩‍💻', likes: 124, saves: 89, archetype: 'Trailblazer' },
    { id: 2, title: 'Meeting Notes Generator', creator: 'Mike R.', avatar: '👨‍🔬', likes: 98, saves: 67, archetype: 'Innovator' },
    { id: 3, title: 'Customer Response Templates', creator: 'Priya S.', avatar: '👩‍🎨', likes: 87, saves: 55, archetype: 'Guide' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Jordan T.', points: 4520, avatar: '🏆', archetype: 'Champion', change: 0 },
    { rank: 2, name: 'Sarah K.', points: 4180, avatar: '👩‍💻', archetype: 'Trailblazer', change: 1 },
    { rank: 3, name: 'Mike R.', points: 3950, avatar: '👨‍🔬', archetype: 'Innovator', change: -1 },
    { rank: 4, name: 'You', points: 1250, avatar: '🙋', archetype: archetype || 'Trailblazer', change: 2, isCurrentUser: true },
    { rank: 5, name: 'Priya S.', points: 1180, avatar: '👩‍🎨', archetype: 'Guide', change: -1 },
    { rank: 6, name: 'James L.', points: 1050, avatar: '👨‍💼', archetype: 'Connector', change: 0 },
  ];

  const successStories = [
    { name: 'Lisa M.', role: 'Marketing Manager', metric: '40% more content', desc: 'How Lisa used AI to transform her content strategy.', archetype: 'Guide' },
    { name: 'David K.', role: 'Data Analyst', metric: '8 hours saved/week', desc: 'David automated his entire reporting workflow.', archetype: 'Trailblazer' },
    { name: 'Ana P.', role: 'HR Director', metric: '3x faster hiring', desc: 'AI-powered screening and candidate communication.', archetype: 'Connector' },
  ];

  const experts = [
    { name: 'Dr. Emily Chen', expertise: ['Prompt Engineering', 'AI Ethics'], archetype: 'Guide', available: true, avatar: '👩‍🏫' },
    { name: 'Marcus Williams', expertise: ['Automation', 'Workflows'], archetype: 'Innovator', available: true, avatar: '👨‍💻' },
    { name: 'Sophie Laurent', expertise: ['Data Analysis', 'Leadership'], archetype: 'Trailblazer', available: false, avatar: '👩‍🔬' },
  ];

  const officeSessions = [
    { title: 'Prompt Engineering Q&A', host: 'Dr. Emily Chen', date: 'Mar 2, 2:00 PM', spots: '5/20', avatar: '👩‍🏫' },
    { title: 'Automation Deep Dive', host: 'Marcus Williams', date: 'Mar 4, 10:00 AM', spots: '12/20', avatar: '👨‍💻' },
  ];

  // Rank change indicator
  const RankChange = ({ change }: { change: number }) => {
    if (change > 0) return (
      <span className="flex items-center gap-0.5" style={{ color: '#14b8a6', fontSize: 12, fontWeight: 600 }}>
        <ChevronUp size={14} />
      </span>
    );
    if (change < 0) return (
      <span className="flex items-center gap-0.5" style={{ color: '#e31937', fontSize: 12, fontWeight: 600 }}>
        <ChevronDown size={14} />
      </span>
    );
    return (
      <span className="flex items-center" style={{ color: 'var(--app-text-hint)', fontSize: 12 }}>
        <Minus size={14} />
      </span>
    );
  };

  // ============================================
  // UI RENDER
  // ============================================
  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* --- Page Header --- */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)' }}>Community</h1>
        <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px' }}>
          Connect with peers, share workflows, and grow together.
        </p>
      </motion.div>

      {/* --- Sub-tabs Navigation --- */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-1 rounded-xl p-1 mb-8 overflow-x-auto"
        style={{ backgroundColor: 'var(--app-tab-bg)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer relative"
            style={{
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'var(--app-surface)' : 'transparent',
              color: activeTab === tab.id ? '#5236ab' : 'var(--app-text-secondary)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* --- Dynamic Content Area --- */}
      <AnimatePresence mode="wait">

        {/* TAB 1: PEER PROGRESS (Workflows & Leaderboard) */}
        {activeTab === 'peers' && (
          <motion.div key="peers" {...fadeUp}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Trending Workflows</h2>
            <motion.div
              className="grid sm:grid-cols-3 gap-4 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {trendingWorkflows.map((wf) => (
                <motion.div
                  key={wf.id}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="rounded-xl p-5 cursor-pointer transition-shadow"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{wf.avatar}</span>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>{wf.creator}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getArchetypeColor(wf.archetype) }} />
                        <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>{wf.archetype}</span>
                      </div>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-3">{wf.title}</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                      <Heart size={12} /> {wf.likes}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                      <TrendingUp size={12} /> {wf.saves} saves
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-lg font-semibold cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--app-brand-light)', color: 'var(--app-brand)', fontSize: 14 }}
                  >
                    Try This Workflow
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }}>Leaderboard</h2>
                <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
                  {(['week', 'month', 'all'] as const).map(p => (
                    <button
                      key={p} onClick={() => setLeaderboardPeriod(p)}
                      className="px-3 py-1 rounded-md cursor-pointer transition-all"
                      style={{
                        fontSize: 12, fontWeight: leaderboardPeriod === p ? 600 : 400,
                        backgroundColor: leaderboardPeriod === p ? 'var(--app-surface)' : 'transparent',
                        color: leaderboardPeriod === p ? 'var(--app-text-primary)' : 'var(--app-text-muted)',
                        boxShadow: leaderboardPeriod === p ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      }}
                    >
                      {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All Time'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                    whileHover={{ scale: 1.005, backgroundColor: (entry as any).isCurrentUser ? undefined : i === 0 ? undefined : 'var(--app-surface-hover)' }}
                    className="flex items-center gap-4 p-3.5 rounded-xl transition-colors"
                    style={{
                      backgroundColor: (entry as any).isCurrentUser ? 'var(--app-brand-light)' : i === 0 ? '#fef3c7' : 'transparent',
                      border: (entry as any).isCurrentUser ? '2px solid #5236ab' : i === 0 ? '1px solid #fde68a' : '1px solid transparent',
                    }}
                  >
                    {/* Rank number */}
                    <span style={{
                      fontSize: i === 0 ? 18 : 16,
                      fontWeight: 700,
                      width: 28,
                      textAlign: 'center',
                      color: i === 0 ? '#d97706' : (entry as any).isCurrentUser ? '#5236ab' : 'var(--app-text-muted)',
                    }}>
                      {entry.rank}
                    </span>

                    {/* Avatar */}
                    <span className="text-xl">{entry.avatar}</span>

                    {/* Name & archetype */}
                    <div className="flex-1">
                      <span style={{
                        fontSize: 14,
                        fontWeight: (entry as any).isCurrentUser ? 700 : 600,
                        color: (entry as any).isCurrentUser ? '#5236ab' : 'var(--app-text-primary)',
                      }}>
                        {entry.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getArchetypeColor(entry.archetype) }} />
                        <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>{entry.archetype}</span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: i === 0 ? '#d97706' : (entry as any).isCurrentUser ? '#5236ab' : 'var(--app-text-primary)',
                      }}>
                        {entry.points.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--app-text-muted)', fontWeight: 500 }}>XP</span>
                    </div>

                    {/* Change indicator */}
                    <RankChange change={entry.change} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* TAB 2: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <motion.div key="stories" {...fadeUp}>
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {successStories.map((story, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="rounded-xl overflow-hidden cursor-pointer transition-shadow"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  {/* Color bar at top - gradient */}
                  <div className="h-2" style={{
                    background: `linear-gradient(90deg, ${getArchetypeColor(story.archetype)}, ${getArchetypeColor(story.archetype)}90, ${getArchetypeColor(story.archetype)}50)`,
                    borderRadius: '0',
                  }} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: `${getArchetypeColor(story.archetype)}15`, color: getArchetypeColor(story.archetype), fontSize: 12 }}>
                        {story.archetype}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{story.role}</span>
                    </div>
                    <div className="text-2xl font-bold mb-3" style={{ color: getArchetypeColor(story.archetype) }}>{story.metric}</div>
                    <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: 1.6 }} className="mb-3">{story.desc}</p>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)' }} className="mb-4">— {story.name}</p>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-1.5 font-semibold cursor-pointer"
                      style={{ color: '#5236ab', fontSize: 14, background: 'none', border: 'none', padding: 0 }}
                    >
                      Read Full Story <ArrowRight size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Impact Metrics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-6">Community Impact</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Time Saved', value: '12,500 hrs', icon: <Clock size={24} />, color: '#5236ab' },
                  { label: 'Active Users', value: '3,248', icon: <Users size={24} />, color: '#14b8a6' },
                  { label: 'Workflows Shared', value: '847', icon: <TrendingUp size={24} />, color: '#f59e0b' },
                  { label: 'Avg. Satisfaction', value: '4.8/5', icon: <Star size={24} />, color: '#e31937' },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${metric.color}12`, color: metric.color }}>
                      {metric.icon}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)' }}>{metric.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* TAB 3: DISCUSSION FORUMS (External Component) */}
        {activeTab === 'forums' && (
          <motion.div key="forums" {...fadeUp}>
            <DiscussionForum
              onSuggestChat={(userName) => {
                navigate('/app/messages');
              }}
            />
          </motion.div>
        )}

        {/* TAB 4: CHAMPIONS NETWORK (Experts & Office Hours) */}
        {activeTab === 'champions' && (
          <motion.div key="champions" {...fadeUp}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Connect with Experts</h2>
            <motion.div
              className="grid sm:grid-cols-3 gap-4 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {experts.map((expert, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="rounded-xl p-6 text-center transition-shadow"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <span className="text-4xl block mb-3">{expert.avatar}</span>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-1">{expert.name}</h4>

                  {/* Archetype label with dot */}
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getArchetypeColor(expert.archetype) }} />
                    <span style={{ fontSize: 12, color: 'var(--app-text-muted)', fontWeight: 500 }}>{expert.archetype}</span>
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                    {expert.expertise.map(e => (
                      <span key={e} className="px-2.5 py-1 rounded-md text-xs" style={{ backgroundColor: 'var(--app-brand-light)', color: 'var(--app-brand)', fontSize: 11, fontWeight: 600 }}>
                        {e}
                      </span>
                    ))}
                  </div>

                  {/* Availability status */}
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: expert.available ? '#22c55e' : '#a1a1aa' }} />
                    <span style={{ fontSize: 12, color: expert.available ? '#16a34a' : 'var(--app-text-hint)', fontWeight: 500 }}>
                      {expert.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <motion.button
                    whileHover={expert.available ? { scale: 1.03 } : {}}
                    whileTap={expert.available ? { scale: 0.97 } : {}}
                    className="w-full py-2.5 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: expert.available ? '#5236ab' : 'var(--app-tab-bg)',
                      color: expert.available ? 'white' : 'var(--app-text-hint)',
                      fontSize: 14,
                      cursor: expert.available ? 'pointer' : 'not-allowed',
                    }}
                    disabled={!expert.available}
                  >
                    <UserPlus size={14} /> Connect
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* Office Hours Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Upcoming Office Hours</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {officeSessions.map((session, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                    className="rounded-xl p-5 transition-shadow"
                    style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{session.avatar}</span>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>{session.title}</h4>
                        <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Hosted by {session.host}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--app-text-secondary)' }}>
                        <Calendar size={14} /> {session.date}
                      </span>
                      <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--app-text-secondary)' }}>
                        <Users size={14} /> {session.spots} spots
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 rounded-lg text-white font-semibold cursor-pointer transition-all"
                      style={{ backgroundColor: '#5236ab', fontSize: 14 }}
                    >
                      Register
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}