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

import React, { useMemo, useState } from 'react';
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
import { PageHeader } from '../../components/PageHeader';
import { DashboardMiniMessages } from '../../components/DashboardMiniMessages';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubTab = 'peers' | 'stories' | 'forums' | 'champions';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  archetype: string;
  change: number;
  isCurrentUser?: boolean;
}

// ─── Animation presets ────────────────────────────────────────────────────────

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

// ─── Module-level helpers ─────────────────────────────────────────────────────

/** Returns the brand color for a given archetype name. */
function getArchetypeColor(name: string): string {
  return archetypes[name.toLowerCase()]?.color || '#5236ab';
}

// ─── Sub-tab navigation config ────────────────────────────────────────────────

const TABS: { id: SubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'peers', label: 'Peer Progress', icon: <Users size={16} /> },
  { id: 'stories', label: 'Success Stories', icon: <BookOpen size={16} /> },
  { id: 'forums', label: 'Discussion Forums', icon: <MessageSquare size={16} /> },
  { id: 'champions', label: 'Champions Network', icon: <Crown size={16} /> },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRENDING_WORKFLOWS = [
  { id: 1, title: 'Email Triage Automation', creator: 'Sarah K.', avatar: '👩‍💻', likes: 124, saves: 89, archetype: 'Trailblazer' },
  { id: 2, title: 'Meeting Notes Generator', creator: 'Mike R.', avatar: '👨‍🔬', likes: 98, saves: 67, archetype: 'Innovator' },
  { id: 3, title: 'Customer Response Templates', creator: 'Priya S.', avatar: '👩‍🎨', likes: 87, saves: 55, archetype: 'Guide' },
];

const SUCCESS_STORIES = [
  { name: 'Lisa M.', role: 'Marketing Manager', metric: '40% more content', desc: 'How Lisa used AI to transform her content strategy.', archetype: 'Guide' },
  { name: 'David K.', role: 'Data Analyst', metric: '8 hours saved/week', desc: 'David automated his entire reporting workflow.', archetype: 'Trailblazer' },
  { name: 'Ana P.', role: 'HR Director', metric: '3x faster hiring', desc: 'AI-powered screening and candidate communication.', archetype: 'Connector' },
];

const EXPERTS = [
  { name: 'Dr. Emily Chen', expertise: ['Prompt Engineering', 'AI Ethics'], archetype: 'Guide', available: true, avatar: '👩‍🏫' },
  { name: 'Marcus Williams', expertise: ['Automation', 'Workflows'], archetype: 'Innovator', available: true, avatar: '👨‍💻' },
  { name: 'Sophie Laurent', expertise: ['Data Analysis', 'Leadership'], archetype: 'Trailblazer', available: false, avatar: '👩‍🔬' },
];

const OFFICE_SESSIONS = [
  { title: 'Prompt Engineering Q&A', host: 'Dr. Emily Chen', date: 'Mar 2, 2:00 PM', spots: '5/20', avatar: '👩‍🏫' },
  { title: 'Automation Deep Dive', host: 'Marcus Williams', date: 'Mar 4, 10:00 AM', spots: '12/20', avatar: '👨‍💻' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Displays a rank change indicator (up / down / neutral). */
function RankChange({ change }: { change: number }) {
  if (change > 0) return (
    <span className="flex items-center gap-0.5 rank-change-up">
      <ChevronUp size={14} />
    </span>
  );
  if (change < 0) return (
    <span className="flex items-center gap-0.5 rank-change-down">
      <ChevronDown size={14} />
    </span>
  );
  return (
    <span className="flex items-center rank-change-neutral">
      <Minus size={14} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { archetype, progress } = useUser();
  const navigate = useNavigate();

  const [miniMessagesOpen, setMiniMessagesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SubTab>('peers');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'week' | 'month' | 'all'>('week');

  // The current user's entry uses the live archetype from context — memoized to avoid recreation per render
  const leaderboard: LeaderboardEntry[] = useMemo(() => [
    { rank: 1, name: 'Jordan T.', points: 4520, avatar: '🏆', archetype: 'Champion', change: 0 },
    { rank: 2, name: 'Sarah K.', points: 4180, avatar: '👩‍💻', archetype: 'Trailblazer', change: 1 },
    { rank: 3, name: 'Mike R.', points: 3950, avatar: '👨‍🔬', archetype: 'Innovator', change: -1 },
    { rank: 4, name: 'You', points: 1250, avatar: '🙋', archetype: archetype || 'Trailblazer', change: 2, isCurrentUser: true },
    { rank: 5, name: 'Priya S.', points: 1180, avatar: '👩‍🎨', archetype: 'Guide', change: -1 },
    { rank: 6, name: 'James L.', points: 1050, avatar: '👨‍💼', archetype: 'Connector', change: 0 },
  ], [archetype]);

  // ============================================
  // UI RENDER
  // ============================================
  return (
    <div className="font-primary">
      {/* --- Page Header --- */}
      <PageHeader
        title="Community"
        subtitle="Connect with peers, share workflows, and grow together."
        progress={{ xp: progress.xp ?? 0, modulesCompleted: progress.modulesCompleted ?? 0, totalModules: progress.totalModules ?? 12, streak: progress.streak ?? 0 }}
        onMessagesClick={() => setMiniMessagesOpen(prev => !prev)}
        onNavigate={navigate}
      />

      {/* --- Sub-tabs Navigation --- */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="community-tab-nav"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`community-tab-button ${activeTab === tab.id ? 'community-tab-active' : 'community-tab-inactive'}`}
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
            <h2 className="leaderboard-title mb-4">Trending Workflows</h2>
            <motion.div
              className="grid sm:grid-cols-3 gap-4 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {TRENDING_WORKFLOWS.map((wf) => (
                <motion.div
                  key={wf.id}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="workflow-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{wf.avatar}</span>
                    <div>
                      <span className="text-sm-semibold text-app-primary">{wf.creator}</span>
                      <div className="flex items-center gap-1">
                        <span className="archetype-dot" style={{ backgroundColor: getArchetypeColor(wf.archetype) }} />
                        <span className="archetype-label">{wf.archetype}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="workflow-title">{wf.title}</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1 metric-stat">
                      <Heart size={12} /> {wf.likes}
                    </span>
                    <span className="flex items-center gap-1 metric-stat">
                      <TrendingUp size={12} /> {wf.saves} saves
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-try-workflow"
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
              className="leaderboard-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="leaderboard-title">Leaderboard</h2>
                <div className="flex gap-1 rounded-lg p-0.5 bg-app-bg">
                  {(['week', 'month', 'all'] as const).map(p => (
                    <button
                      key={p} onClick={() => setLeaderboardPeriod(p)}
                      className={`leaderboard-period-btn ${leaderboardPeriod === p ? 'leaderboard-period-active' : 'leaderboard-period-inactive'}`}
                    >
                      {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All Time'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {leaderboard.map((entry, i) => {
                  const entryClass = entry.isCurrentUser ? 'leaderboard-entry-current' : i === 0 ? 'leaderboard-entry-first' : 'leaderboard-entry-other';
                  const rankClass = i === 0 ? 'leaderboard-rank-first' : entry.isCurrentUser ? 'leaderboard-rank-current' : 'leaderboard-rank-other';
                  const pointsClass = i === 0 ? 'leaderboard-points-first' : entry.isCurrentUser ? 'leaderboard-points-current' : 'leaderboard-points-other';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                      whileHover={{ scale: 1.005, backgroundColor: entry.isCurrentUser ? undefined : i === 0 ? undefined : 'var(--app-surface-hover)' }}
                      className={`leaderboard-entry ${entryClass}`}
                    >
                      {/* Rank number */}
                      <span className={`leaderboard-rank-number ${rankClass}`}>
                        {entry.rank}
                      </span>

                      {/* Avatar */}
                      <span className="text-xl">{entry.avatar}</span>

                      {/* Name & archetype */}
                      <div className="flex-1">
                        <span className={entry.isCurrentUser ? 'leaderboard-name leaderboard-name-current' : 'leaderboard-name'}>
                          {entry.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="archetype-dot" style={{ backgroundColor: getArchetypeColor(entry.archetype) }} />
                          <span className="archetype-label">{entry.archetype}</span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-2">
                        <span className={`leaderboard-points ${pointsClass}`}>
                          {entry.points.toLocaleString()}
                        </span>
                        <span className="leaderboard-xp-label">XP</span>
                      </div>

                      {/* Change indicator */}
                      <RankChange change={entry.change} />
                    </motion.div>
                  );
                })}
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
              {SUCCESS_STORIES.map((story, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="story-card"
                >
                  {/* Color bar at top - gradient */}
                  <div className="story-color-bar" style={{
                    background: `linear-gradient(90deg, ${getArchetypeColor(story.archetype)}, ${getArchetypeColor(story.archetype)}90, ${getArchetypeColor(story.archetype)}50)`,
                  }} />
                  <div className="story-content">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="story-archetype-badge" style={{ backgroundColor: `${getArchetypeColor(story.archetype)}15`, color: getArchetypeColor(story.archetype) }}>
                        {story.archetype}
                      </span>
                      <span className="story-role">{story.role}</span>
                    </div>
                    <div className="story-metric" style={{ color: getArchetypeColor(story.archetype) }}>{story.metric}</div>
                    <p className="story-description">{story.desc}</p>
                    <p className="story-author">— {story.name}</p>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="story-cta"
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
              className="card-surface-shadow p-6"
            >
              <h2 className="leaderboard-title mb-6">Community Impact</h2>
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
                    <div className="impact-metric-icon" style={{ backgroundColor: `${metric.color}12`, color: metric.color }}>
                      {metric.icon}
                    </div>
                    <div className="impact-metric-value">{metric.value}</div>
                    <div className="impact-metric-label">{metric.label}</div>
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
            <h2 className="leaderboard-title mb-4">Connect with Experts</h2>
            <motion.div
              className="grid sm:grid-cols-3 gap-4 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {EXPERTS.map((expert, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                  className="expert-card"
                >
                  <span className="expert-avatar">{expert.avatar}</span>
                  <h4 className="expert-name">{expert.name}</h4>

                  {/* Archetype label with dot */}
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span className="archetype-dot" style={{ backgroundColor: getArchetypeColor(expert.archetype) }} />
                    <span className="archetype-label font-medium">{expert.archetype}</span>
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                    {expert.expertise.map(e => (
                      <span key={e} className="expert-expertise-tag">
                        {e}
                      </span>
                    ))}
                  </div>

                  {/* Availability status */}
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <span className={`availability-indicator ${expert.available ? 'availability-available' : 'availability-unavailable'}`} />
                    <span className={expert.available ? 'availability-text-available' : 'availability-text-unavailable'}>
                      {expert.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <motion.button
                    whileHover={expert.available ? { scale: 1.03 } : {}}
                    whileTap={expert.available ? { scale: 0.97 } : {}}
                    className={expert.available ? 'btn-connect-available' : 'btn-connect-unavailable'}
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
              <h2 className="leaderboard-title mb-4">Upcoming Office Hours</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {OFFICE_SESSIONS.map((session, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(82, 54, 171, 0.10)' }}
                    className="office-session-card"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="office-session-avatar">{session.avatar}</span>
                      <div>
                        <h4 className="office-session-title">{session.title}</h4>
                        <span className="office-session-host">Hosted by {session.host}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5 office-session-meta">
                        <Calendar size={14} /> {session.date}
                      </span>
                      <span className="flex items-center gap-1.5 office-session-meta">
                        <Users size={14} /> {session.spots} spots
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-register"
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

      <DashboardMiniMessages
        isOpen={miniMessagesOpen}
        onClose={() => setMiniMessagesOpen(false)}
        onOpenFullMessages={() => navigate('/app/messages')}
      />
    </div>
  );
}