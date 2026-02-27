/**
 * ============================================
 * 👤 PROFILE PAGE — ProfilePage.tsx
 * ============================================
 * 
 * This page acts as the user's "Home Base" for their personal identity within the app.
 * It's divided into several sub-pages to manage different aspects of their profile.
 * 
 * 🗺️ SUB-TABS:
 * 1. Personal Info: Edit name, bio, job details and set notification preferences.
 * 2. My Archetype: A deep dive into their quiz results (The Trailblazer, etc).
 * 3. My Goals: View the goals set during the onboarding wizard.
 * 4. My Progress: Visual summary of badges earned and XP milestones.
 * 5. My Workflows: Collection of saved prompts and resources.
 * 6. Settings: Privacy controls and data export.
 * 
 * HINT FOR BEGINNERS:
 * We use `AnimatePresence` and `motion.div` to make the content fade/slide 
 * nicely whenever you switch between these sub-tabs.
 */

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

// Define the valid tab IDs for our sub-menu
type SubTab = 'info' | 'archetype' | 'goals' | 'progress' | 'workflows' | 'settings';

// Icon mapping to help us find the right icon for the current Archetype
const iconMap: Record<string, any> = {
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, archetype, progress } = useUser();

  // -- Local Page State --
  const [activeTab, setActiveTab] = useState<SubTab>('info'); // Default page is 'info'

  // Look up full data for the current user's archetype
  const arch = archetype ? archetypes[archetype.toLowerCase()] : archetypes.trailblazer;
  const ArchIcon = arch ? iconMap[arch.icon] : Mountain;

  // Configuration for the tab navigation bar
  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'archetype', label: 'My Archetype', icon: <Shield size={16} /> },
    { id: 'goals', label: 'My Goals', icon: <Target size={16} /> },
    { id: 'progress', label: 'My Progress', icon: <TrendingUp size={16} /> },
    { id: 'workflows', label: 'My Workflows', icon: <FolderOpen size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  // ============================================
  // SECTION 1: HEADER (Visual Preview)
  // ============================================
  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Top Banner Area with Avatar and Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-100 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#5236ab]" />
            )}
          </div>
          {/* Subtle edit button on avatar */}
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer">
            <Camera size={12} className="text-gray-500" />
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }}>{user?.name || 'Alex Chen'}</h1>
          <p style={{ fontSize: 14, color: '#767676' }}>{user?.email || 'alex@example.com'}</p>
          <div className="flex items-center gap-3 mt-2">
            {/* Dynamic badge for Archetype */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: `${arch?.color}15`, border: `1px solid ${arch?.color}30` }}>
              {ArchIcon && <ArchIcon size={14} style={{ color: arch?.color }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: arch?.color }}>{arch?.name}</span>
            </span>
            {/* Streak Counter */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
              <Flame size={12} className="text-orange-500" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ea580c' }}>{progress.streak} day streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: SUB-TAB NAVIGATION BAR          */}
      {/* ============================================ */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer"
            style={{
              fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#5236ab' : '#5c5c5c',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* SECTION 3: DYNAMIC SUB-PAGES CONTENT        */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">

        {/* --- PAGE: PERSONAL INFO (Editing & Settings) --- */}
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-6">Project Metadata</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: user?.name || 'Alex Chen' },
                  { label: 'Email Address', value: user?.email || 'alex@example.com', readOnly: true },
                  { label: 'Job Title', value: 'Product Designer' },
                  { label: 'Department', value: 'Innovation Lab' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block mb-1 font-semibold text-sm">{field.label}</label>
                    <input
                      type="text" defaultValue={field.value} readOnly={field.readOnly}
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 outline-none focus:border-[#5236ab]"
                      style={{ fontSize: 16, backgroundColor: field.readOnly ? '#f8f9fb' : 'white' }}
                    />
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-3 rounded-lg bg-[#5236ab] text-white font-semibold cursor-pointer">Save Profile</button>
            </div>

            {/* Notification Toggles */}
            <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-6">Notifications</h2>
              <div className="space-y-4">
                {['Learning Reminders', 'Community Mentions', 'Achievement Alerts'].map((label) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <span className="font-semibold text-sm">{label}</span>
                      <p className="text-xs text-gray-400">Receive alerts when something important happens.</p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-[#5236ab] relative cursor-pointer">
                      <div className="absolute top-0.5 left-[22px] w-5 h-5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- PAGE: ARCHETYPE DETAILS --- */}
        {activeTab === 'archetype' && arch && (
          <motion.div key="archetype" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="h-3" style={{ backgroundColor: arch.color }} />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: arch.color, color: 'white' }}>
                    {ArchIcon && <ArchIcon size={28} />}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700 }}>{arch.name}</h2>
                    <p style={{ color: arch.color, fontWeight: 600 }}>"{arch.tagline}"</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{arch.description}</p>

                {/* Visual traits summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {arch.traits.map(trait => (
                    <div key={trait} className="p-3 rounded-xl text-center font-bold text-sm" style={{ backgroundColor: `${arch.color}10`, color: '#151515' }}>
                      {trait}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/survey')} className="mt-6 text-[#5236ab] font-bold underline cursor-pointer">Retake Personality Quiz</button>
          </motion.div>
        )}

        {/* --- PAGE: PROGRESS & ACHIEVEMENTS --- */}
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <span className="text-xs font-bold text-gray-400">TOTAL XP</span>
                <div className="text-2xl font-bold">{progress.xp.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <span className="text-xs font-bold text-gray-400">LEVEL</span>
                <div className="text-2xl font-bold">{progress.level}</div>
              </div>
            </div>
            {/* Badge Grid */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Badge Collection</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                {['Early Adopter', 'Streak Master', 'Prompt Pro', 'Innovator'].map((badge, i) => (
                  <div key={i} className={`p-4 rounded-xl border opacity-${i < 2 ? '100' : '40'} ${i < 2 ? 'bg-purple-50' : 'bg-gray-50'}`}>
                    <div className="text-3xl mb-1">🏅</div>
                    <span className="text-[10px] font-bold block">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- PAGE: SETTINGS (General) --- */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Privacy</h3>
                <p className="text-sm text-gray-400 mb-4">Control who can see your progress and archetype results.</p>
                <button className="px-4 py-2 border rounded-lg text-sm font-semibold cursor-pointer">Manage Connections</button>
              </div>
              <div className="pt-6 border-t">
                <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold cursor-pointer">Deactivate Account</button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}