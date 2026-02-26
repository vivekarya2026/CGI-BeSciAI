import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Shield, Target, TrendingUp, FolderOpen, Settings,
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
  Star, Zap, Award, Clock, Flame, BookOpen, Calendar,
  Edit3, Camera, Save, X, ChevronRight, Download, Share2,
  Bell, Eye, HelpCircle, ExternalLink, MessageSquare,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { archetypes } from '../../data/archetypes';

type SubTab = 'info' | 'archetype' | 'goals' | 'progress' | 'workflows' | 'settings';

const iconMap: Record<string, any> = {
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, archetype, progress } = useUser();
  const [activeTab, setActiveTab] = useState<SubTab>('info');

  const arch = archetype ? archetypes[archetype.toLowerCase()] : archetypes.trailblazer;
  const ArchIcon = arch ? iconMap[arch.icon] : Mountain;

  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'archetype', label: 'My Archetype', icon: <Shield size={16} /> },
    { id: 'goals', label: 'My Goals', icon: <Target size={16} /> },
    { id: 'progress', label: 'My Progress', icon: <TrendingUp size={16} /> },
    { id: 'workflows', label: 'My Workflows', icon: <FolderOpen size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  const badges = [
    { name: 'Early Adopter', icon: '🌟', earned: true, desc: 'Joined the platform in the first month' },
    { name: 'Fast Learner', icon: '⚡', earned: true, desc: 'Completed 3 modules in one week' },
    { name: 'Prompt Pro', icon: '🎯', earned: false, desc: 'Master prompt engineering basics' },
    { name: 'Team Player', icon: '🤝', earned: false, desc: 'Help 5 peers with their learning' },
    { name: 'Streak Master', icon: '🔥', earned: false, desc: 'Maintain a 30-day streak' },
    { name: 'Innovator', icon: '💡', earned: false, desc: 'Share 3 original workflows' },
  ];

  const savedResources = [
    { title: 'Email Writing Prompt Template', type: 'Template', savedDate: 'Feb 20' },
    { title: 'AI Data Analysis Tutorial', type: 'Video', savedDate: 'Feb 18' },
    { title: 'Best Practices Checklist', type: 'Guide', savedDate: 'Feb 15' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-100 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#5236ab]" />
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50" aria-label="Change avatar">
            <Camera size={12} className="text-gray-500" />
          </button>
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }}>{user?.name || 'Alex Chen'}</h1>
          <p style={{ fontSize: 14, color: '#767676' }}>{user?.email || 'alex@example.com'}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: `${arch?.color}15`, border: `1px solid ${arch?.color}30` }}>
              {ArchIcon && <ArchIcon size={14} style={{ color: arch?.color }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: arch?.color }}>{arch?.name}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
              <Flame size={12} className="text-orange-500" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ea580c' }}>{progress.streak} day streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
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
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PERSONAL INFO */}
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Edit Profile</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" style={{ fontSize: 14, color: '#5c5c5c' }}>
                  <Edit3 size={14} /> Edit
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: user?.name || 'Alex Chen' },
                  { label: 'Email', value: user?.email || 'alex@example.com', readOnly: true },
                  { label: 'Job Title', value: 'Product Manager' },
                  { label: 'Department', value: 'Product & Innovation' },
                  { label: 'Company', value: 'Acme Corp' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: '#333333', display: 'block', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      readOnly={field.readOnly}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#5236ab] focus:ring-2 focus:ring-[#5236ab]/20 transition-all"
                      style={{
                        fontSize: 16,
                        minHeight: 44,
                        backgroundColor: field.readOnly ? '#efefef' : 'white',
                        color: field.readOnly ? '#767676' : '#333333',
                      }}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#333333', display: 'block', marginBottom: 6 }}>Bio</label>
                  <textarea
                    defaultValue="AI enthusiast and product manager exploring the intersection of technology and human behavior."
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#5236ab] focus:ring-2 focus:ring-[#5236ab]/20 transition-all resize-none"
                    style={{ fontSize: 16, color: '#333333' }}
                  />
                  <span style={{ fontSize: 12, color: '#a8a8a8' }} className="mt-1 block text-right">89/200</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-3 rounded-lg text-white cursor-pointer font-semibold" style={{ backgroundColor: '#5236ab', fontSize: 14 }}>
                  Save Changes
                </button>
                <button className="px-6 py-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" style={{ fontSize: 14, color: '#5c5c5c' }}>
                  Cancel
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Learning reminders', desc: 'Daily prompts to continue learning', enabled: true },
                  { label: 'Community updates', desc: 'New discussions, replies, and mentions', enabled: true },
                  { label: 'Achievement alerts', desc: 'Badge unlocks and milestone completions', enabled: true },
                  { label: 'Weekly digest', desc: 'Summary of your weekly progress', enabled: false },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>{pref.label}</span>
                      <p style={{ fontSize: 12, color: '#767676' }}>{pref.desc}</p>
                    </div>
                    <button
                      className="w-11 h-6 rounded-full transition-colors cursor-pointer relative"
                      style={{ backgroundColor: pref.enabled ? '#5236ab' : '#c0c0c0' }}
                      aria-label={`Toggle ${pref.label}`}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow"
                        style={{ left: pref.enabled ? 22 : 2 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* MY ARCHETYPE */}
        {activeTab === 'archetype' && arch && (
          <motion.div key="archetype" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Archetype Card */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-8" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="h-3" style={{ backgroundColor: arch.color }} />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: arch.color, color: 'white' }}>
                    {ArchIcon && <ArchIcon size={28} />}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#151515' }}>{arch.name}</h2>
                    <p style={{ fontSize: 16, fontWeight: 500, color: arch.color }}>"{arch.tagline}"</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${arch.color}15`, color: arch.color, fontSize: 12, fontWeight: 600 }}>
                      {arch.foggLabel}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 16, lineHeight: '24px', color: '#333333', maxWidth: '75ch' }} className="mb-6">{arch.description}</p>

                {/* Traits */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {arch.traits.map((trait, i) => (
                    <div key={trait} className="text-center p-3 rounded-xl" style={{ backgroundColor: `${arch.color}08`, border: `1px solid ${arch.color}15` }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{trait}</span>
                    </div>
                  ))}
                </div>

                {/* Learning style */}
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: arch.bgLight }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#151515' }} className="mb-1">Learning Style</h4>
                  <p style={{ fontSize: 14, color: '#5c5c5c', lineHeight: '20px' }}>{arch.learningStyle}</p>
                </div>
              </div>
            </div>

            {/* Retake */}
            <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515' }} className="mb-2">Retake Assessment</h3>
              <p style={{ fontSize: 14, color: '#767676', lineHeight: '20px' }} className="mb-4">
                Your archetype may change over time as you grow. Retaking the assessment will update your profile and learning path.
              </p>
              <button
                onClick={() => navigate('/survey')}
                className="px-5 py-2.5 rounded-lg border-2 border-[#5236ab] text-[#5236ab] font-semibold cursor-pointer hover:bg-[#f2f1f9] transition-colors"
                style={{ fontSize: 14 }}
              >
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}

        {/* MY GOALS */}
        {activeTab === 'goals' && (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Current Goals</h2>
                <button className="px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" style={{ fontSize: 14, color: '#5c5c5c' }}>
                  Edit Goals
                </button>
              </div>

              {/* Primary Goal */}
              <div className="p-5 rounded-xl border-2 border-[#5236ab] mb-4" style={{ backgroundColor: '#f2f1f9' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5236ab' }} className="mb-2 block">PRIMARY GOAL</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Increase Productivity</h3>
                <p style={{ fontSize: 14, color: '#5c5c5c', lineHeight: '20px' }}>Automate tasks and save hours every week with AI tools.</p>
                <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: '#5236ab' }} initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1 }} />
                </div>
                <span style={{ fontSize: 12, color: '#767676' }} className="mt-1 block">45% toward goal</span>
              </div>

              {/* Focus areas */}
              <div className="mb-4">
                <span style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>Focus Areas</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Writing & Communication', 'Data Analysis', 'Project Management'].map(area => (
                    <span key={area} className="px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: '#f2f1f9', color: '#5236ab', fontWeight: 600, fontSize: 13 }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-4">
                <div>
                  <span style={{ fontSize: 12, color: '#767676' }}>Timeline</span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>8 weeks (4 remaining)</p>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#767676' }}>Commitment</span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>Moderate (20 min/day)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MY PROGRESS */}
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Learning Hours', value: '24.5', icon: <Clock size={20} />, color: '#5236ab', bg: '#f2f1f9' },
                { label: 'Modules Completed', value: `${progress.modulesCompleted}`, icon: <BookOpen size={20} />, color: '#14b8a6', bg: '#ccfbf1' },
                { label: 'Current Streak', value: `${progress.streak} days`, icon: <Flame size={20} />, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Total XP', value: progress.xp.toLocaleString(), icon: <Zap size={20} />, color: '#e31937', bg: '#fce8eb' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#151515' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#767676' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-6">Badges & Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-center p-4 rounded-xl border"
                    style={{
                      borderColor: badge.earned ? '#e6e3f3' : '#efefef',
                      opacity: badge.earned ? 1 : 0.5,
                      backgroundColor: badge.earned ? '#f2f1f9' : '#fafafa',
                    }}
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: badge.earned ? '#151515' : '#a8a8a8' }}>{badge.name}</span>
                    <p style={{ fontSize: 10, color: '#a8a8a8', lineHeight: '14px', marginTop: 4 }}>{badge.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* MY WORKFLOWS */}
        {activeTab === 'workflows' && (
          <motion.div key="workflows" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4">Bookmarked Resources</h2>
              <div className="space-y-3">
                {savedResources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}>
                        {res.type === 'Template' ? <FolderOpen size={18} /> : res.type === 'Video' ? <BookOpen size={18} /> : <BookOpen size={18} />}
                      </div>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#151515' }}>{res.title}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 12, color: '#767676' }}>{res.type}</span>
                          <span style={{ fontSize: 12, color: '#a8a8a8' }}>Saved {res.savedDate}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Empty state for custom prompts */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f2f1f9' }}>
                <Zap size={28} style={{ color: '#5236ab' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515' }} className="mb-2">No Custom Prompts Yet</h3>
              <p style={{ fontSize: 14, color: '#767676', lineHeight: '20px' }} className="mb-4 max-w-sm mx-auto">
                Start creating custom prompts from the Quick Wins section and they'll appear here.
              </p>
              <button onClick={() => navigate('/app/learn')} className="px-5 py-2.5 rounded-lg text-white cursor-pointer font-semibold" style={{ backgroundColor: '#5236ab', fontSize: 14 }}>
                Explore Quick Wins
              </button>
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="space-y-6">
              {/* Privacy */}
              <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4 flex items-center gap-2">
                  <Eye size={20} /> Privacy Controls
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Profile Visibility', desc: 'Who can see your profile', value: 'Public' },
                    { label: 'Show Activity', desc: 'Display your learning activity to peers', toggle: true, enabled: true },
                    { label: 'Show on Leaderboard', desc: 'Include your rank in community leaderboards', toggle: true, enabled: true },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>{setting.label}</span>
                        <p style={{ fontSize: 12, color: '#767676' }}>{setting.desc}</p>
                      </div>
                      {setting.toggle ? (
                        <button className="w-11 h-6 rounded-full cursor-pointer relative" style={{ backgroundColor: setting.enabled ? '#5236ab' : '#c0c0c0' }} aria-label={`Toggle ${setting.label}`}>
                          <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" style={{ left: setting.enabled ? 22 : 2 }} />
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-gray-100" style={{ fontSize: 13, color: '#5c5c5c' }}>{setting.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-4 flex items-center gap-2">
                  <HelpCircle size={20} /> Feedback & Support
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Submit Feedback', icon: <MessageSquare size={16} /> },
                    { label: 'Contact Support', icon: <HelpCircle size={16} /> },
                    { label: 'FAQ', icon: <ExternalLink size={16} /> },
                    { label: 'Feature Requests', icon: <Lightbulb size={16} /> },
                  ].map((item, i) => (
                    <button key={i} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors text-left w-full" style={{ fontSize: 14, color: '#333333' }}>
                      <span className="text-[#5236ab]">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-white rounded-xl p-6 border border-red-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#b00020' }} className="mb-3">Danger Zone</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#333333' }}>Export Data</span>
                    <p style={{ fontSize: 12, color: '#767676' }}>Download all your data</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" style={{ fontSize: 13, color: '#5c5c5c' }}>
                    <Download size={14} className="inline mr-1" /> Export
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}