import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Compass,
  Target,
  BookOpen,
  Trophy,
  Brain,
  BarChart3,
  Zap,
  FlaskConical,
  Users,
  Building2,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleScrollToPlatform = useCallback(() => {
    const el = document.getElementById('platform');
    if (!el) {
      window.location.hash = '#platform';
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="landing-dark">
      <nav className="landing2-nav">
        <div className="landing2-nav-inner">
          <button
            type="button"
            className="landing2-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="landing2-logo-icon" aria-hidden="true">✦</span>
            <span className="landing2-logo-text">BeSciAI</span>
          </button>

          <motion.button
            whileHover={{ opacity: 0.88, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/dashboard')}
            className="landing2-btn-signin"
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      <header className="landing2-hero">
        <div className="landing2-noise" aria-hidden="true" />

        <div className="landing2-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="landing2-badge">
              <Sparkles size={14} aria-hidden="true" />
              Personalized BeSciAI Journey
            </div>

            <h1 className="landing2-hero-title">
              Discover Your
              <br />
              <span className="landing2-gradient-text">AI Superpower</span>
            </h1>

            <p className="landing2-hero-sub">
              Set your AI goals and unlock a personalized learning path. Connect with like-minded peers, and accelerate
              your AI journey—built on behavioral science.
            </p>

            <div className="landing2-cta-row">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/onboarding')}
                className="landing2-btn-primary"
              >
                ✦ Start your Journey <span aria-hidden="true">→</span>
              </motion.button>

              {/* <motion.button
                whileHover={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(240,236,249,1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScrollToPlatform}
                className="landing2-btn-ghost"
              >
                See how it works
              </motion.button> */}
            </div>

            {/* <p className="landing2-hero-note">
              <Clock size={13} aria-hidden="true" /> 8–10 minutes to complete your profile
            </p> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            className="landing2-proof-bar"
          >
            <div className="landing2-proof-item">
              <div className="landing2-proof-num">90</div>
              <div className="landing2-proof-label">Day Adoption Milestones</div>
            </div>
            <div className="landing2-proof-divider" aria-hidden="true" />
            <div className="landing2-proof-item">
              <div className="landing2-proof-num">100%</div>
              <div className="landing2-proof-label">Role-Specific Journeys</div>
            </div>
            <div className="landing2-proof-divider" aria-hidden="true" />
            <div className="landing2-proof-item">
              <div className="landing2-proof-num">AI-First</div>
              <div className="landing2-proof-label">Behavioral Framework</div>
            </div>
          </motion.div>
        </div>
      </header>

      <hr className="landing2-divider" />

      <section id="platform" className="landing2-section">
        <div className="landing2-platform-grid">
          <div>
            <div className="landing2-section-label">The Platform</div>
            <h2 className="landing2-section-title">
              From AI Awareness to
              <br />
              Daily AI Habit
            </h2>
            <p className="landing2-section-body">
              BeSciAI bridges the gap between knowing AI exists and making it a seamless part of how your teams work—every
              single day.
            </p>
            <p className="landing2-section-body landing2-mt-16">
              Built on behavioral science, our platform adapts to individual roles, learning styles, and workloads—turning
              organizational change into personal growth.
            </p>
          </div>

          <div className="landing2-platform-visual">
            {[
              {
                n: '01',
                t: 'Set Your AI Goals',
                d: 'Define your role, readiness level, and what AI success looks like for you personally.',
              },
              {
                n: '02',
                t: 'Get Your Learning Path',
                d: 'Unlock a role-specific curriculum with real prompt libraries, use cases, and tool access.',
              },
              {
                n: '03',
                t: 'Build the Habit',
                d: 'Behavioral nudges, milestones, and peer recognition keep you engaged and progressing.',
              },
              {
                n: '04',
                t: 'Measure Your Growth',
                d: 'Track AI skill maturity with self-reporting tools and team-level adoption insights.',
              },
            ].map((s) => (
              <div key={s.n} className="landing2-journey-step">
                <div className="landing2-step-num">{s.n}</div>
                <div>
                  <div className="landing2-step-title">{s.t}</div>
                  <div className="landing2-step-desc">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="landing2-divider" />

      <section id="features" className="landing2-section landing2-features">
        <div className="landing2-section-label">Core Features</div>
        <h2 className="landing2-section-title">
          Everything You Need to
          <br />
          Adopt AI Confidently
        </h2>

        <div className="landing2-features-grid">
          {[
            {
              icon: <Compass size={20} />,
              title: 'Unified Start Here Hub',
              desc: 'One clear entry point that guides every user through tools, training, and next steps—no confusion, no scattered resources.',
            },
            {
              icon: <Target size={20} />,
              title: 'Role-Specific Journeys',
              desc: 'Tailored learning paths for functional, technical, and hybrid roles. Prompt examples mapped to your actual job, not generic theory.',
            },
            {
              icon: <BookOpen size={20} />,
              title: 'Searchable Prompt Library',
              desc: 'Real-world, AI-confirmed prompt examples ready for immediate use in your daily workflows—approved and accessible.',
            },
            {
              icon: <Trophy size={20} />,
              title: 'Peer Recognition System',
              desc: 'Badges, shout-outs, and mentor matching to celebrate progress and build social momentum within your team.',
            },
            {
              icon: <Brain size={20} />,
              title: 'Behavioral Nudges',
              desc: 'Science-backed micro-interventions that build lasting AI habits through rewarding, low-friction daily interactions.',
            },
            {
              icon: <BarChart3 size={20} />,
              title: 'Progress & Analytics',
              desc: 'Self-tracking of AI usage, milestones, and skill maturity—so you and your org always know where you stand.',
            },
          ].map((f) => (
            <div key={f.title} className="landing2-feature-card">
              <div className="landing2-feature-icon" aria-hidden="true">
                {f.icon}
              </div>
              <div className="landing2-feature-title">{f.title}</div>
              <div className="landing2-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing2-pillars">
        <div className="landing2-pillars-inner">
          <div className="landing2-section-label">Why BeSciAI</div>
          <h2 className="landing2-section-title">Built Different, by Design</h2>
          <div className="landing2-pillars-grid">
            {[
              { icon: <Zap size={22} />, title: 'Frictionless by Default', desc: 'Every interaction is designed to remove barriers, not add steps.' },
              { icon: <FlaskConical size={22} />, title: 'Behavioral Science Core', desc: 'Habit formation and nudge theory baked into every feature.' },
              { icon: <Users size={22} />, title: 'Community-Powered', desc: 'Peer learning, examples, and mentorship amplify individual progress.' },
              { icon: <Building2 size={22} />, title: 'Enterprise-Ready', desc: 'Compliance-aware, scalable, and designed for org-wide rollout.' },
            ].map((p) => (
              <div key={p.title} className="landing2-pillar">
                <span className="landing2-pillar-icon" aria-hidden="true">
                  {p.icon}
                </span>
                <div className="landing2-pillar-title">{p.title}</div>
                <div className="landing2-pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="who" className="landing2-section landing2-segments">
        <div className="landing2-section-label">Who It&apos;s For</div>
        <h2 className="landing2-section-title">
          Built for Every Role
          <br />
          on the AI Journey
        </h2>
        <div className="landing2-segments-grid">
          {[
            {
              role: 'End Users',
              desc: 'Employees at any AI-readiness level who need a clear, structured path to confidently integrate AI into daily work—without survey fatigue or anxiety.',
              tag: 'Low → High Readiness',
              tagClass: 'landing2-tag landing2-tag-purple',
            },
            {
              role: 'Team Managers',
              desc: 'Leaders who want to drive participation, assess team readiness, and get real feedback on AI adoption—with minimal manual effort.',
              tag: 'Pilot & Rollout',
              tagClass: 'landing2-tag landing2-tag-rose',
            },
            {
              role: 'Sponsors & Admins',
              desc: 'Executives and program owners who need org-wide visibility, adoption reporting, and proof that the program is delivering measurable results.',
              tag: 'Enterprise Overview',
              tagClass: 'landing2-tag landing2-tag-violet',
            },
          ].map((s) => (
            <div key={s.role} className="landing2-segment-card">
              <div className="landing2-segment-role">{s.role}</div>
              <div className="landing2-segment-desc">{s.desc}</div>
              <span className={s.tagClass}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="landing2-divider" />

      <section className="landing2-final-cta">
        <div className="landing2-section-label">Get Started</div>
        <h2 className="landing2-final-title">
          Your AI Journey
          <br />
          Starts in <span className="landing2-gradient-text">8 Minutes</span>
        </h2>
        <p className="landing2-final-sub">
          Join teams already using BeSciAI to turn AI awareness into lasting organizational capability.
        </p>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/onboarding')}
          className="landing2-btn-primary landing2-btn-primary-lg"
        >
          ✦ Start your Journey <ArrowRight size={18} aria-hidden="true" />
        </motion.button>
      </section>

      <footer className="landing2-footer">
        <div className="landing2-footer-inner">
          <div className="landing2-footer-left">
            <div className="landing2-footer-logo" aria-hidden="true">✦</div>
            <span className="landing2-footer-brand">BeSciAI</span>
          </div>
          <p className="landing2-footer-copy">© {new Date().getFullYear()} BeSciAI. All rights reserved.</p>
          <div className="landing2-footer-links">
            <button type="button" className="landing2-footer-link">Privacy</button>
            <button type="button" className="landing2-footer-link">Terms</button>
            <button type="button" className="landing2-footer-link">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
