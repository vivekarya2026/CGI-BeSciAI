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
import clsx from 'clsx';

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
    <div className="min-h-screen font-primary">

      {/* ============================================ */}
      {/* NAVIGATION BAR (Sticky/Fixed)              */}
      {/* ============================================ */}
      <nav className={clsx('landing-nav', isScrolled ? 'landing-nav-scrolled' : 'landing-nav-transparent')}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="landing-logo-container">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className={clsx('landing-logo-text hidden sm:block', isScrolled ? 'landing-logo-text-dark' : 'landing-logo-text-light')}>
              BeSciAI
            </span>
          </div>

          {/* Right Actions Section */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app/dashboard')}
              className="landing-btn-signin"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* SECTION 1: HERO (The big top section)      */}
      {/* ============================================ */}
      <section className="landing-hero-gradient relative min-h-[75vh] flex items-center justify-center overflow-hidden">
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
            <div className="landing-hero-badge">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="landing-hero-badge-text">
                Personalized BeSciAI Journey
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="landing-hero-title text-3xl sm:text-4xl md:text-[38px]">
              Discover Your AI Superpower
            </h1>

            {/* Subheadline (Description) */}
            <p className="landing-hero-subtitle text-base sm:text-lg">
              Set your AI goals and unlock a personalized learning path.
              Connect with like-minded peers, and accelerate your AI journey.
            </p>

            {/* Call to Action Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 32px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/onboarding')}
                className="landing-cta-button"
              >
                <Sparkles size={20} />
                Start your Journey
                <ArrowRight size={20} />
              </motion.button>
            </div>

            <div className="landing-time-badge justify-center">
              <Clock size={14} />
              <span className="landing-time-badge-text ">8-10 minutes to complete</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: START WITH THE GOALS - FUTURISTIC */}
      {/* ============================================ */}
      <section className="landing-section-futuristic">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
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
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Dynamic Growth Tracking',
                desc: 'Visualize your skill development with interactive timelines and predictive analytics.',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Gamified Milestones',
                desc: 'Unlock achievements, earn XP, and compete on leaderboards as you master AI capabilities.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="landing-glass-card"
              >
                {/* Neon glow effect on hover */}
                <div className="landing-glass-card-hover-glow" />

                <div className="relative z-10">
                  <div className="landing-glass-icon-container">
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
            className="landing-timeline-container"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Your AI Journey Timeline</h3>
              <p className="text-white/70">Watch your skills compound over time</p>
            </div>

            {/* Timeline visualization */}
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="landing-timeline-line">
                <motion.div
                  className="landing-timeline-progress"
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
                  <div className={clsx('landing-timeline-milestone', idx <= 2 ? 'landing-timeline-milestone-active' : 'landing-timeline-milestone-inactive')}>
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
      <section className="landing-section-light">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="landing-section-title mb-3">
              What You'll Discover
            </h2>
            <p className="landing-section-subtitle">
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
                className="landing-archetype-card"
                style={{ borderLeftColor: arch.color }}
              >
                <div className="text-3xl mb-3">{arch.icon}</div>
                <h4 className="landing-archetype-title">{arch.name}</h4>
                <p className="landing-archetype-tagline">{arch.tagline}</p>
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
            <h2 className="landing-section-title mb-3">
              Choose Your Starting Flow
            </h2>
              <p className="landing-section-subtitle mb-12">
                Select how you’d like to kick off your AI adoption journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Survey Option */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/onboarding')}
              className="landing-survey-option-card landing-survey-option-card-recommended"
            >
              <div className="landing-survey-badge-recommended">
                RECOMMENDED
              </div>
              <Brain size={36} className="landing-survey-icon-recommended mx-auto mb-4" />
              <h3 className="landing-survey-title">Quick Goal Setup</h3>
              <p className="landing-survey-description">
                A focused set of questions to quickly define your AI goals and priority outcomes.
              </p>
              <div className="landing-survey-time">
                <Clock size={14} />
                <span>5-8 minutes</span>
              </div>
            </motion.div>

            {/* Full Survey Option */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/onboarding')}
              className="landing-survey-option-card landing-survey-option-card-standard"
            >
              <div className="landing-survey-badge-accurate">
                MOST ACCURATE
              </div>
              <TrendingUp size={36} className="landing-survey-icon-accurate mx-auto mb-4 mt-2" />
              <h3 className="landing-survey-title">Deep Dive Planning</h3>
              <p className="landing-survey-description">
                A more detailed planning flow to deeply align your AI goals with how you work today.
              </p>
              <div className="landing-survey-time">
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
            className="landing-cta-secondary"
          >
            Start Your Plan
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: FOOTER                          */}
      {/* ============================================ */}
      <footer className="landing-footer">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="landing-footer-logo">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="landing-footer-text">BeSciAI Platform</span>
          </div>
          <p className="landing-footer-copyright">
            Powered by CGI — Personalized AI adoption journeys
          </p>
        </div>
      </footer>
    </div>
  );
}
