/**
 * ============================================
 * 🎉 REVEAL PAGE — RevealPage.tsx
 * ============================================
 *
 * This page is shown immediately after the user finishes the Survey.
 * It has a dramatic animation that reveals their "Archetype" (e.g., The Connector).
 *
 * HOW IT WORKS:
 * 1. It reads the `archetypeId` passed from the Survey Page via `location.state`.
 * 2. It fetches the full archetype details from `archetypes.ts`.
 * 3. It uses two `setTimeout` timers to trigger the animations:
 *    - `revealed`: Triggers the icon to pop in.
 *    - `showContent`: Makes all the text drop in below it.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mountain, Lamp, Network, Compass, Trophy, Lightbulb, ArrowRight, Star, Shield, Zap, CheckCircle } from 'lucide-react';
import { archetypes } from '../../data/archetypes';
import { useUser } from '../../context/UserContext';
import clsx from 'clsx';

// Basic mapping to connect a string name to a Lucide React Icon component
const iconMap: Record<string, React.ReactNode> = {
  Mountain: <Mountain size={48} />,
  Lamp: <Lamp size={48} />,
  Network: <Network size={48} />,
  Compass: <Compass size={48} />,
  Trophy: <Trophy size={48} />,
  Lightbulb: <Lightbulb size={48} />,
};

const traitIcons = [Star, Shield, Zap, CheckCircle];

export default function RevealPage() {
  const navigate = useNavigate();
  const location = useLocation();        // React Router hook to read passed state
  const { archetype: userArchetype } = useUser();

  // ============================================
  // SECTION 1: ANIMATION STATE
  // ============================================
  const [revealed, setRevealed] = useState(false);        // Triggers the initial icon pop
  const [showContent, setShowContent] = useState(false);  // Triggers the text scrolling in

  // Get the archetype ID (either passed from the survey, or default to trailblazer)
  const archetypeId = (location.state as any)?.archetypeId || userArchetype?.toLowerCase() || 'trailblazer';
  // Look up the full details from our data file
  const arch = archetypes[archetypeId];

  // This runs once when the page loads, setting up the timing for the dramatic reveal
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 800);      // Pop icon after 0.8 seconds
    const t2 = setTimeout(() => setShowContent(true), 2000);  // Show text after 2 seconds
    return () => { clearTimeout(t1); clearTimeout(t2); };     // Cleanup if they leave early
  }, []);

  // Safety check: if somehow we passed a bad ID
  if (!arch) {
    return (
      <div className="min-h-screen flex items-center justify-center font-primary">
        <p>Archetype not found. <button onClick={() => navigate('/survey')} className="text-cgi-purple underline">Retake survey</button></p>
      </div>
    );
  }

  // ============================================
  // SECTION 2: UI RENDER
  // ============================================
  return (
    <div className="reveal-container">
      {/* ---- HERO ANIMATION SECTION ---- */}
      <section
        className="reveal-hero-section"
        style={{
          background: `linear-gradient(135deg, ${arch.color}22 0%, ${arch.color}44 50%, ${arch.color}22 100%)`,
        }}
      >
        {/* Animated background particles traveling upward */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 12 + 4,
                height: Math.random() * 12 + 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: arch.color,
                opacity: 0.2,
              }}
              animate={{ y: [0, -(Math.random() * 100 + 50)], opacity: [0.2, 0] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6">
          {/* 1. The big icon that pops in */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: revealed ? 1 : 0, opacity: revealed ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="reveal-icon-container"
              style={{ backgroundColor: arch.color }}
            >
              {iconMap[arch.icon]}
            </motion.div>
          </AnimatePresence>

          {/* 2. The title and tagline that fade in below it */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <p className="reveal-subtitle">You are...</p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.8 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
              className="reveal-title"
            >
              {arch.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ delay: 1.2 }}
              className="reveal-tagline"
              style={{ color: arch.color }}
            >
              "{arch.tagline}"
            </motion.p>

            {/* A small badge with the Fogg Behavior Model label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ delay: 1.5 }}
              className="reveal-fogg-badge"
              style={{ backgroundColor: `${arch.color}15`, border: `1px solid ${arch.color}30` }}
            >
              <span className="reveal-fogg-text" style={{ color: arch.color }}>{arch.foggLabel}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---- DETAILS SECTION (Only shown after animation finishes) ---- */}
      {showContent && (
        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Description & Traits */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16">
            <h2 className="reveal-section-title">Your Archetype Explained</h2>
            <p className="reveal-description">{arch.description}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {arch.traits.map((trait, i) => {
                const Icon = traitIcons[i % traitIcons.length];
                return (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="reveal-trait-card"
                  >
                    <Icon size={24} style={{ color: arch.color }} className="mx-auto mb-3" />
                    <span className="reveal-trait-text">{trait}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Strengths & Challenges */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-16">
            <h2 className="reveal-section-title mb-6">Personalized Insights</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="reveal-insight-card">
                <h3 className="reveal-insight-title">
                  <Star size={20} style={{ color: arch.color }} /> Motivation
                </h3>
                <p className="reveal-insight-text">{arch.motivation}</p>
              </div>
              <div className="reveal-insight-card">
                <h3 className="reveal-insight-title">
                  <Shield size={20} className="text-archetype-trailblazer" /> Growth Areas
                </h3>
                <ul className="space-y-2">
                  {arch.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 reveal-insight-text">
                      <span className="text-archetype-trailblazer mt-1">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Tips */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Tips for You</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {arch.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="reveal-tip-card"
                  style={{ backgroundColor: arch.bgLight, border: `1px solid ${arch.color}20` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="reveal-tip-number" style={{ backgroundColor: arch.color }}>
                      {i + 1}
                    </div>
                  </div>
                  <p className="reveal-tip-text">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA: Next steps to Onboarding */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/onboarding')}
              className="reveal-cta-button"
            >
              Build Your Adoption Plan <ArrowRight size={18} />
            </motion.button>
            <p className="reveal-cta-caption">Set your goals and personalize your dashboard</p>
          </motion.div>

        </div>
      )}
    </div>
  );
}
