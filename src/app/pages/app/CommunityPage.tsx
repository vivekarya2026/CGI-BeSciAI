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
 * 
 * HINT FOR BEGINNERS:
 * We use a helper function `getArchetypeColor` to make sure the UI 
 * matches the color of the user's specific Archetype (e.g. Purple for Trailblazers).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Users, BookOpen, MessageSquare, Crown, Heart, TrendingUp,
  MessageCircle, Star, Calendar, Clock, ArrowRight, Filter,
  ChevronUp, ChevronDown, Award, Flame, UserPlus,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { archetypes } from '../../data/archetypes';
import { DiscussionForum } from '../../components/DiscussionForum';

// Defining the sub-tabs for the page
type SubTab = 'peers' | 'stories' | 'forums' | 'champions';

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

  // ============================================
  // UI RENDER
  // ============================================
  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* --- Page Header --- */}
      <div className="mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }}>Community</h1>
        <p style={{ fontSize: 16, color: '#5c5c5c', lineHeight: '24px' }}>
          Connect with peers, share workflows, and grow together.
        </p>
      </div>

      {/* --- Sub-tabs Navigation --- */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer"
            style={{
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#5236ab' : '#5c5c5c',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Dynamic Content Area --- */}
      <AnimatePresence mode="wait">

        {/* TAB 1: PEER PROGRESS (Workflows & Leaderboard) */}
        {activeTab === 'peers' && (
          <motion.div key="peers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">Trending Workflows</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {trendingWorkflows.map((wf, i) => (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 cursor-pointer"
                  style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{wf.avatar}</span>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{wf.creator}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getArchetypeColor(wf.archetype) }} />
                        <span style={{ fontSize: 11, color: '#767676' }}>{wf.archetype}</span>
                      </div>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#151515' }} className="mb-3">{wf.title}</h4>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                      <Heart size={12} /> {wf.likes}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                      <TrendingUp size={12} /> {wf.saves} saves
                    </span>
                  </div>
                  <button className="w-full mt-4 py-2 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#f2f1f9', color: '#5236ab', fontSize: 14 }}>
                    Try This Workflow
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Leaderboard Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Leaderboard</h2>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                  {(['week', 'month', 'all'] as const).map(p => (
                    <button
                      key={p} onClick={() => setLeaderboardPeriod(p)}
                      className="px-3 py-1 rounded-md cursor-pointer transition-all"
                      style={{
                        fontSize: 12, fontWeight: leaderboardPeriod === p ? 600 : 400,
                        backgroundColor: leaderboardPeriod === p ? 'white' : 'transparent',
                        color: leaderboardPeriod === p ? '#151515' : '#767676',
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
                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg"
                    style={{
                      backgroundColor: (entry as any).isCurrentUser ? '#f2f1f9' : i === 0 ? '#fef3c7' : 'transparent',
                      border: (entry as any).isCurrentUser ? '2px solid #5236ab' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 700, width: 28, textAlign: 'center', color: '#767676' }}>{entry.rank}</span>
                    <span className="text-xl">{entry.avatar}</span>
                    <div className="flex-1">
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{entry.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getArchetypeColor(entry.archetype) }} />
                        <span style={{ fontSize: 11, color: '#767676' }}>{entry.archetype}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#151515' }}>{entry.points.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: '#767676' }}>XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {successStories.map((story, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer"
                  style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div className="h-3" style={{ background: `linear-gradient(90deg, ${getArchetypeColor(story.archetype)}, ${getArchetypeColor(story.archetype)}80)` }} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: `${getArchetypeColor(story.archetype)}15`, color: getArchetypeColor(story.archetype), fontSize: 12 }}>
                        {story.archetype}
                      </span>
                      <span style={{ fontSize: 12, color: '#767676' }}>{story.role}</span>
                    </div>
                    <div className="text-2xl font-bold mb-2" style={{ color: getArchetypeColor(story.archetype) }}>{story.metric}</div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#151515' }} className="mb-2">{story.desc}</p>
                    <p style={{ fontSize: 14, color: '#767676' }}>— {story.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Impact Metrics Dashboard */}
            <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-6">Community Impact</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Time Saved', value: '12,500 hrs', icon: <Clock size={24} />, color: '#5236ab' },
                  { label: 'Active Users', value: '3,248', icon: <Users size={24} />, color: '#14b8a6' },
                  { label: 'Workflows Shared', value: '847', icon: <TrendingUp size={24} />, color: '#f59e0b' },
                  { label: 'Avg. Satisfaction', value: '4.8/5', icon: <Star size={24} />, color: '#e31937' },
                ].map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${metric.color}12`, color: metric.color }}>
                      {metric.icon}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#151515' }}>{metric.value}</div>
                    <div style={{ fontSize: 12, color: '#767676' }}>{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: DISCUSSION FORUMS (External Component) */}
        {activeTab === 'forums' && (
          <motion.div key="forums" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <DiscussionForum
              onSuggestChat={(userName) => {
                navigate('/app/messages');
              }}
            />
          </motion.div>
        )}

        {/* TAB 4: CHAMPIONS NETWORK (Experts & Office Hours) */}
        {activeTab === 'champions' && (
          <motion.div key="champions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">Connect with Experts</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {experts.map((expert, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 text-center"
                  style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <span className="text-4xl block mb-3">{expert.avatar}</span>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#151515' }} className="mb-1">{expert.name}</h4>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {expert.expertise.map(e => (
                      <span key={e} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#f2f1f9', color: '#5236ab', fontSize: 11, fontWeight: 600 }}>
                        {e}
                      </span>
                    ))}
                  </div>
                  <button
                    className="w-full py-2.5 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2"
                    style={{ backgroundColor: expert.available ? '#5236ab' : '#efefef', color: expert.available ? 'white' : '#a8a8a8', fontSize: 14 }}
                    disabled={!expert.available}
                  >
                    <UserPlus size={14} /> Connect
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Office Hours Sessions */}
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">Upcoming Office Hours</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {officeSessions.map((session, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl p-5 border border-gray-100"
                  style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{session.avatar}</span>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#151515' }}>{session.title}</h4>
                      <span style={{ fontSize: 13, color: '#767676' }}>Hosted by {session.host}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1" style={{ fontSize: 13, color: '#5c5c5c' }}>
                      <Calendar size={14} /> {session.date}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 13, color: '#5c5c5c' }}>
                      <Users size={14} /> {session.spots} spots
                    </span>
                  </div>
                  <button className="w-full py-2.5 rounded-lg text-white font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', fontSize: 14 }}>
                    Register
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}