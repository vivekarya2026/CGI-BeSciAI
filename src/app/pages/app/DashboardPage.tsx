import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Flame, Trophy, BookOpen, Clock, Zap, Star, ArrowRight, Play,
  Mountain, Lamp, Network, Compass, Lightbulb, Award,
  TrendingUp, Users, Heart, MessageCircle, ChevronRight,
  Send,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { archetypes, learningModules } from '../../data/archetypes';
import { NotificationsPanel } from '../../components/NotificationsPanel';

const iconMap: Record<string, any> = {
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, archetype, progress } = useUser();
  const [progressTab, setProgressTab] = useState<'complete' | 'quick'>('complete');

  const arch = archetype ? archetypes[archetype.toLowerCase()] : archetypes.trailblazer;
  const ArchIcon = arch ? iconMap[arch.icon] : Mountain;

  const completionPct = Math.round((progress.modulesCompleted / progress.totalModules) * 100);

  const nextModules = learningModules.filter(m => !m.completed).slice(0, 3);
  const currentModule = learningModules.find(m => !m.completed && !m.locked);

  const milestones = [
    { title: 'Complete 5 Modules', progress: 60, reward: '🏅', dueIn: '3 days' },
    { title: 'Earn Prompt Pro Badge', progress: 40, reward: '⭐', dueIn: '1 week' },
    { title: 'Help 3 Peers', progress: 20, reward: '🤝', dueIn: '2 weeks' },
  ];

  const peerActivity = [
    { name: 'Sarah K.', action: 'completed', target: 'Advanced Prompt Techniques', time: '2 hours ago', avatar: '👩‍💻' },
    { name: 'Mike R.', action: 'earned', target: 'Fast Learner Badge', time: '4 hours ago', avatar: '👨‍🔬' },
    { name: 'Priya S.', action: 'shared', target: 'Email Automation Workflow', time: '5 hours ago', avatar: '👩‍🎨' },
    { name: 'James L.', action: 'completed', target: 'AI Ethics & Best Practices', time: 'Yesterday', avatar: '👨‍💼' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl" style={{ fontWeight: 600, color: '#151515', lineHeight: '1.3' }}>
            Welcome back, {user?.name || 'Alex'} 👋
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#5c5c5c', lineHeight: '24px' }}>
            Your AI adoption journey is {completionPct}% complete. Keep it up!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Archetype badge */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/app/profile')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full cursor-pointer"
            style={{ backgroundColor: `${arch?.color}15`, border: `1px solid ${arch?.color}30` }}
          >
            {ArchIcon && <ArchIcon size={16} style={{ color: arch?.color }} />}
            <span style={{ fontSize: 14, fontWeight: 600, color: arch?.color }}>{arch?.name}</span>
          </motion.button>

          {/* Streak */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
            <Flame size={16} className="text-orange-500" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ea580c' }}>{progress.streak}</span>
            <span style={{ fontSize: 12, color: '#9a3412' }}>day streak</span>
          </div>

          {/* Notifications */}
          <NotificationsPanel onNavigate={(path) => navigate(path)} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Modules Completed', value: `${progress.modulesCompleted}/${progress.totalModules}`, icon: <BookOpen size={20} />, color: '#5236ab', bg: '#f2f1f9' },
          { label: 'XP Earned', value: progress.xp.toLocaleString(), icon: <Zap size={20} />, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Level', value: progress.level, icon: <Star size={20} />, color: '#14b8a6', bg: '#ccfbf1' },
          { label: 'Badges', value: progress.badges.length, icon: <Award size={20} />, color: '#e31937', bg: '#fce8eb' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-gray-100"
            style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#151515' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#767676' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Your Progress</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['complete', 'quick'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setProgressTab(tab)}
                className="px-4 py-1.5 rounded-md transition-all cursor-pointer"
                style={{
                  fontSize: 14,
                  fontWeight: progressTab === tab ? 600 : 400,
                  backgroundColor: progressTab === tab ? 'white' : 'transparent',
                  color: progressTab === tab ? '#151515' : '#767676',
                  boxShadow: progressTab === tab ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab === 'complete' ? 'Complete Path' : 'Quick Path'}
              </button>
            ))}
          </div>
        </div>

        {progressTab === 'complete' ? (
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Circular progress */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f2f1f9" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={arch?.color || '#5236ab'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - completionPct / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontSize: 28, fontWeight: 700, color: '#151515' }}>{completionPct}%</span>
                <span style={{ fontSize: 12, color: '#767676' }}>Complete</span>
              </div>
            </div>

            {/* Module progress bars */}
            <div className="flex-1 w-full space-y-3">
              {learningModules.slice(0, 6).map((mod, i) => (
                <div key={mod.id} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                    style={{
                      backgroundColor: mod.completed ? '#1ab977' : mod.locked ? '#c0c0c0' : '#5236ab',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {mod.completed ? '✓' : i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 13, color: mod.locked ? '#a8a8a8' : '#333333', fontWeight: mod.completed ? 400 : 500 }}>
                        {mod.title}
                      </span>
                      <span style={{ fontSize: 11, color: '#a8a8a8' }}>{mod.duration}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: mod.completed ? '#1ab977' : '#5236ab' }}
                        initial={{ width: 0 }}
                        animate={{ width: mod.completed ? '100%' : `${(mod as any).progress || 0}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-4">
              <TrendingUp size={32} style={{ color: '#5236ab' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-2">
              {completionPct}% Complete
            </h3>
            <p style={{ fontSize: 16, color: '#5c5c5c' }} className="mb-4">
              {progress.totalModules - progress.modulesCompleted} modules remaining
            </p>
            <button
              onClick={() => navigate('/app/learn')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white cursor-pointer"
              style={{ backgroundColor: '#5236ab', fontSize: 14, fontWeight: 600 }}
            >
              Jump to Next Step <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recommended Next Steps */}
        <div className="lg:col-span-2">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">
            Recommended Next Steps
          </h2>
          <div className="space-y-3">
            {nextModules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 cursor-pointer"
                style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
                onClick={() => navigate('/app/learn')}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: i === 0 ? '#f2f1f9' : i === 1 ? '#fef3c7' : '#ccfbf1',
                    color: i === 0 ? '#5236ab' : i === 1 ? '#f59e0b' : '#14b8a6',
                  }}
                >
                  {i === 0 ? <Play size={20} /> : <BookOpen size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#151515' }}>{mod.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: '#767676' }}>
                      <Clock size={12} /> {mod.duration}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: mod.difficulty === 'Intermediate' ? '#fef6e9' : '#f2f1f9',
                        color: mod.difficulty === 'Intermediate' ? '#855a14' : '#2d1e5e',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {mod.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-white shrink-0 cursor-pointer"
                  style={{ backgroundColor: '#5236ab', fontSize: 14, fontWeight: 600 }}
                >
                  {i === 0 ? 'Continue' : 'Start'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">
            Upcoming Milestones
          </h2>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-4 border border-gray-100"
                style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{m.reward}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{m.title}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#5236ab' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: 11, color: '#a8a8a8' }}>{m.progress}%</span>
                  <span style={{ fontSize: 11, color: '#767676' }}>Due in {m.dueIn}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Suggestions — Connect with Peers */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f2f1f9' }}>
              <Send size={16} style={{ color: '#5236ab' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515', margin: 0 }}>Chat with Peers</h2>
              <p style={{ fontSize: 13, color: '#767676', margin: 0 }}>Connect and message learners on similar paths</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/messages')}
            className="flex items-center gap-1 text-[#5236ab] cursor-pointer hover:underline"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Open Messages <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Sarah K.', avatar: '👩‍💻', status: 'online', topic: 'Prompt Engineering tips', archetype: 'Trailblazer', color: '#f59e0b' },
            { name: 'Mike R.', avatar: '👨‍🔬', status: 'online', topic: 'Workflow automation help', archetype: 'Innovator', color: '#84cc16' },
            { name: 'Dr. Emily Chen', avatar: '👩‍🏫', status: 'away', topic: 'AI Ethics guidance', archetype: 'Guide', color: '#14b8a6' },
            { name: 'Priya S.', avatar: '👩‍🎨', status: 'online', topic: 'Content strategy chat', archetype: 'Guide', color: '#14b8a6' },
          ].map((peer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              onClick={() => navigate('/app/messages')}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-100 cursor-pointer transition-all"
              style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="relative mb-2">
                <span className="text-3xl">{peer.avatar}</span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: peer.status === 'online' ? '#1ab977' : '#f1a425' }}
                />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{peer.name}</span>
              <div className="flex items-center gap-1 mt-0.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: peer.color }} />
                <span style={{ fontSize: 11, color: '#767676' }}>{peer.archetype}</span>
              </div>
              <span style={{ fontSize: 12, color: '#5c5c5c', textAlign: 'center', lineHeight: '16px' }}>{peer.topic}</span>
              <button
                className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: '#f2f1f9', color: '#5236ab', fontSize: 13, fontWeight: 600 }}
              >
                <MessageCircle size={13} /> Chat
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Peer Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Peer Activity</h2>
          <button
            onClick={() => navigate('/app/community')}
            className="flex items-center gap-1 text-[#5236ab] cursor-pointer hover:underline"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {peerActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-lg shrink-0">
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 14, color: '#333333', lineHeight: '20px' }}>
                  <span className="font-semibold">{activity.name}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-semibold" style={{ color: '#5236ab' }}>{activity.target}</span>
                </p>
                <p style={{ fontSize: 12, color: '#a8a8a8' }}>{activity.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Like">
                  <Heart size={16} className="text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Comment">
                  <MessageCircle size={16} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}