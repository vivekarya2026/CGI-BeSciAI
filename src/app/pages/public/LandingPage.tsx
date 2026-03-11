/**
 * ============================================
 * 🚀 LANDING PAGE — LandingPage.tsx
 * ============================================
 *
 * This is the first page users see when they visit the site (the "Home" page).
 * It's designed to be visually engaging and explain the value of the app.
 *
 * Key Sections:
 * 1. Hero Section: Big gradient background, animated particles, main Call to Action (CTA).
 * 2. Features/Benefits: "Why Take This Assessment?" (3 column grid).
 * 3. Archetypes Preview: Teases the 6 possible results users can get.
 * 4. Survey Options: Let users choose between a quick or full assessment.
 *
 * ANIMATIONS:
 * We use `framer-motion` (imported as `motion/react`) to make things fade in,
 * slide up, or pulse. The `<motion.div>` tags are just like regular `<div>`s,
 * but they accept special animation props like `initial`, `animate`, and `transition`.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Clock, Target, Users, ArrowRight, Zap, Brain, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  // `useNavigate` lets us change pages programmatically when buttons are clicked
  const navigate = useNavigate();

  // State to track if the user has scrolled down (to change Navbar appearance)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-primary)" }}>

      {/* ============================================ */}
      {/* NAVIGATION BAR (Sticky/Fixed)              */}
      {/* ============================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md py-3 shadow-md border-b border-gray-100'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #a82465 0%, #e31937 100%)' }}
            >
              <Sparkles size={22} className="text-white" />
            </div>
            <span className={`font-bold text-xl tracking-tight hidden sm:block transition-colors ${isScrolled ? 'text-[#151515]' : 'text-white'
              }`}>
              BeSciAI
            </span>
          </div>

          {/* Right Actions Section */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app/dashboard')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer"
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
              }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* SECTION 1: HERO (The big top section)      */}
      {/* ============================================ */}
      <section
        className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #200a58 0%, #5236ab 40%, #a82465 70%, #e31937 100%)' }}
      >
        {/* ---- Animated Background Particles ---- */}
        {/* We create an array of 20 elements and map over them to create random circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'rgba(255,255,255,0.1)',
              }}
              // Make them slowly float up and down
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* ---- Main Hero Content ---- */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Small badge at the top */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-white/90 text-sm font-medium" style={{ fontSize: 14, lineHeight: '17px' }}>
                Personalized BeSciAI Journey
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-white mb-6 leading-tight text-3xl sm:text-4xl md:text-[38px]" style={{ fontWeight: 700, lineHeight: '1.2', color: 'white' }}>
              Discover Your AI Superpower
            </h1>

            {/* Subheadline (Description) */}
            <p className="text-white/85 max-w-2xl mx-auto mb-10 text-base sm:text-lg" style={{ lineHeight: '28px', fontWeight: 400 }}>
              Set your AI goals and unlock a personalized learning path.
              Connect with like-minded peers, and accelerate your AI journey.
            </p>

            {/* Call to Action Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 32px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center justify-center gap-2 text-white px-10 py-4 rounded-xl font-bold transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  fontSize: 18,
                  lineHeight: '24px',
                  minHeight: 52,
                  boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
                }}
              >
                <Sparkles size={20} />
                Start your Journey
                <ArrowRight size={20} />
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-white/70">
              <Clock size={14} />
              <span style={{ fontSize: 14, lineHeight: '17px' }}>8-10 minutes to complete</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: START WITH THE GOALS - FUTURISTIC */}
      {/* ============================================ */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 150 + 30,
                height: Math.random() * 150 + 30,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'white' }}>
              Start with the Goals
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Define your AI ambitions and watch your skills evolve with intelligent, adaptive learning
            </p>
          </motion.div>

          {/* Glassmorphism Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain size={32} />,
                title: 'AI-Powered Insights',
                desc: 'Machine learning algorithms analyze your progress and adapt your learning path in real-time.',
                gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(109,40,217,0.2) 100%)',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Dynamic Growth Tracking',
                desc: 'Visualize your skill development with interactive timelines and predictive analytics.',
                gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Gamified Milestones',
                desc: 'Unlock achievements, earn XP, and compete on leaderboards as you master AI capabilities.',
                gradient: 'linear-gradient(135deg, rgba(217,70,239,0.2) 0%, rgba(168,85,247,0.2) 100%)',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-2xl p-8 border cursor-pointer relative overflow-hidden"
                style={{
                  background: item.gradient,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                {/* Neon glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/80">
                    {item.desc}
                  </p>
                </div>

                {/* Animated progress ring preview */}
                <motion.div
                  className="absolute bottom-4 right-4 w-12 h-12"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="60 40"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Animated Timeline Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 rounded-2xl p-8 border"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.15) 100%)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Your AI Journey Timeline</h3>
              <p className="text-white/70">Watch your skills compound over time</p>
            </div>

            {/* Timeline visualization */}
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-6 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: 'easeOut', delay: 0.6 }}
                />
              </div>

              {/* Milestones */}
              {['Start', 'Week 2', 'Month 1', 'Month 2', 'Month 3', 'Mastery'].map((label, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: idx <= 2 ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {idx <= 2 ? <CheckCircle size={20} /> : idx + 1}
                  </div>
                  <span className="text-xs text-white/70 text-center whitespace-nowrap">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: ARCHETYPES PREVIEW              */}
      {/* ============================================ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f2f1f9' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }} className="mb-3">
              What You'll Discover
            </h2>
            <p style={{ fontSize: 18, lineHeight: '28px', color: '#5c5c5c' }} className="max-w-2xl mx-auto">
              Your archetype reveals how you learn, collaborate, and adopt new technologies.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏔️', name: 'The Trailblazer', tagline: 'Master the summit', color: '#f59e0b' },
              { icon: '🏮', name: 'The Guide', tagline: 'Light the way', color: '#14b8a6' },
              { icon: '🔗', name: 'The Connector', tagline: 'Stronger together', color: '#8b5cf6' },
              { icon: '🧭', name: 'The Explorer', tagline: 'Chart your course', color: '#0ea5e9' },
              { icon: '🏆', name: 'The Champion', tagline: 'Claim the prize', color: '#e31937' },
              { icon: '💡', name: 'The Innovator', tagline: 'Break the mold', color: '#84cc16' },
            ].map((arch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-xl p-6 border-l-4 cursor-pointer"
                style={{
                  borderLeftColor: arch.color,
                  boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <div className="text-3xl mb-3">{arch.icon}</div>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#151515' }}>{arch.name}</h4>
                <p style={{ fontSize: 14, lineHeight: '20px', color: '#767676' }}>{arch.tagline}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: SURVEY SELECTION                */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 600, color: '#151515' }} className="mb-3">
              Choose Your Starting Flow
            </h2>
              <p style={{ fontSize: 18, lineHeight: '28px', color: '#5c5c5c' }} className="mb-12">
                Select how you’d like to kick off your AI adoption journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Survey Option */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/onboarding')}
              className="bg-white rounded-xl p-8 cursor-pointer border-2 border-[#5236ab] relative"
              style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.12)' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-white px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: '#5236ab', fontSize: 12, lineHeight: '18px' }}
                >
                  RECOMMENDED
                </span>
              </div>
              <Brain size={36} className="mx-auto mb-4" style={{ color: '#5236ab' }} />
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-2">Quick Goal Setup</h3>
              <p style={{ fontSize: 14, color: '#767676', lineHeight: '20px' }} className="mb-4">
                A focused set of questions to quickly define your AI goals and priority outcomes.
              </p>
              <div className="flex items-center justify-center gap-2" style={{ color: '#5c5c5c', fontSize: 14 }}>
                <Clock size={14} />
                <span>5-8 minutes</span>
              </div>
            </motion.div>

            {/* Full Survey Option */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/onboarding')}
              className="bg-white rounded-xl p-8 cursor-pointer border border-gray-200"
              style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 relative">
                <span
                  className="text-white px-3 py-1 rounded-full text-xs font-bold absolute -top-6 left-1/2 -translate-x-1/2"
                  style={{ backgroundColor: '#f59e0b', fontSize: 12, lineHeight: '18px' }}
                >
                  MOST ACCURATE
                </span>
              </div>
              <TrendingUp size={36} className="mx-auto mb-4 mt-2" style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }} className="mb-2">Deep Dive Planning</h3>
              <p style={{ fontSize: 14, color: '#767676', lineHeight: '20px' }} className="mb-4">
                A more detailed planning flow to deeply align your AI goals with how you work today.
              </p>
              <div className="flex items-center justify-center gap-2" style={{ color: '#5c5c5c', fontSize: 14 }}>
                <Clock size={14} />
                <span>10-15 minutes</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding')}
            className="mt-12 inline-flex items-center gap-2 text-white px-10 py-4 rounded-lg font-semibold cursor-pointer"
            style={{
              backgroundColor: '#5236ab',
              fontSize: 16,
              lineHeight: '24px',
              boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
            }}
          >
            Start Your Plan
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: FOOTER                          */}
      {/* ============================================ */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5236ab' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span style={{ fontSize: 14, color: '#767676' }}>BeSciAI Platform</span>
          </div>
          <p style={{ fontSize: 12, color: '#a8a8a8' }}>
            Powered by CGI — Personalized AI adoption journeys
          </p>
        </div>
      </footer>
    </div>
  );
}
