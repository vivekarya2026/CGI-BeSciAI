/**
 * Office Hours — standalone page: Your Usage Activity + Live & Upcoming, Recordings, Q&A, 1:1 Coaching.
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, Clock, Flame, Radio, Headphones, MessageCircle, User, Video, Search, CheckCircle, Trophy,
} from 'lucide-react';
import {
  officeHourLive,
  officeHourUpcoming,
  officeHourRecordings,
  officeHourQA,
  officeHourSlots,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';

/** Heatmap intensity 0–4; colors from guidelines (gray 50 → purple scale). */
const HEATMAP_COLORS = ['#efefef', '#e6e3f3', '#cbc3e6', '#9e83f5', '#5236ab'] as const;

/** Build activity level per day for last 364 days (0 = none, 1–4 = intensity). Uses streak for recent days. */
function buildYearActivity(streak: number): number[] {
  const days = 364;
  const levels: number[] = [];
  for (let i = 0; i < days; i++) {
    const daysAgo = days - 1 - i;
    if (daysAgo < streak) {
      levels.push(Math.min(4, 2 + Math.floor(daysAgo / 7)));
    } else {
      const seed = (i * 31) % 100;
      levels.push(seed < 25 ? 1 : seed < 40 ? 2 : 0);
    }
  }
  return levels;
}

/** Format date per guidelines: Short for lists. */
function formatShortDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export default function OfficeHoursPage() {
  const { progress } = useUser();
  const [officeSubTab, setOfficeSubTab] = useState<'live' | 'recordings' | 'qa' | 'coaching'>('live');
  const [officePostSession, setOfficePostSession] = useState<string | null>(null);
  const [qaSearch, setQaSearch] = useState('');
  const [qaExpandedId, setQaExpandedId] = useState<string | null>(null);
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  const [bookedSlotId, setBookedSlotId] = useState<string | null>(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [recordingNotes, setRecordingNotes] = useState<Record<string, string>>({});

  const yearActivity = useMemo(() => buildYearActivity(progress.streak), [progress.streak]);
  const totalActivity = yearActivity.filter(l => l > 0).length;
  const today = new Date();
  const lastYearStart = new Date(today);
  lastYearStart.setDate(lastYearStart.getDate() - 363);
  const currentStreakStart = new Date(today);
  currentStreakStart.setDate(currentStreakStart.getDate() - (progress.streak - 1));
  const longestStreak = Math.max(progress.streak, 7);

  const weekCount = 53;
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cellSize = 10;
  const gap = 2;
  const colWidth = cellSize + gap;
  const labelWidth = 24;
  const labelGap = 8;
  const gridWidth = weekCount * colWidth;
  const heatmapBlockMinWidth = labelWidth + labelGap + gridWidth;
  const monthStarts = useMemo(() => {
    const starts: { month: string; col: number }[] = [];
    let lastMonth = -1;
    for (let idx = 0; idx < yearActivity.length; idx++) {
      const d = new Date(today);
      d.setDate(d.getDate() - (364 - 1 - idx));
      if (d.getDate() === 1 && d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        starts.push({ month: months[d.getMonth()], col: Math.floor(idx / 7) });
      }
    }
    return starts;
  }, [yearActivity.length, today]);

  return (
    <div className="font-primary">
      <h1 className="page-title">Office Hours</h1>
      <p className="page-subtitle">
        Join live sessions, watch recordings, browse Q&A, or book 1:1 coaching.
      </p>

      {/* Your Usage Activity — heatmap + legend + summary cards */}
      <section aria-label="Your usage activity" className="heatmap-container">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="heatmap-title text-lg sm:text-xl">Your Usage Activity</h2>
          <div className="flex items-center gap-2 heatmap-legend-text shrink-0">
            <span>Less</span>
            {HEATMAP_COLORS.map((color, i) => (
              <div key={i} className="heatmap-legend-box shrink-0" style={{ backgroundColor: color }} aria-hidden />
            ))}
            <span>More</span>
          </div>
        </div>

        <div
          className="w-full max-w-full overflow-x-auto overflow-y-hidden"
          style={{ WebkitOverflowScrolling: 'touch', marginLeft: -4, marginRight: -4 }}
          aria-label="Scroll to see full year"
        >
          <div className="flex flex-col shrink-0" style={{ minWidth: heatmapBlockMinWidth }}>
            <div className="flex items-center mb-1" style={{ marginLeft: labelWidth + labelGap, width: gridWidth, position: 'relative', height: 16 }}>
              {monthStarts.map(({ month, col }) => (
                <span key={`${month}-${col}`} className="heatmap-month-label" style={{ position: 'absolute', left: col * colWidth }}>{month}</span>
              ))}
            </div>

            <div className="flex gap-2" style={{ gap: labelGap }}>
              <div className="flex flex-col justify-around shrink-0 heatmap-day-label" style={{ width: labelWidth, marginTop: 2 }}>
                {[0, 2, 4, 6].map(r => (
                  <span key={r}>{dayLabels[r]}</span>
                ))}
              </div>
              <div
                className="rounded overflow-hidden shrink-0"
                style={{ display: 'grid', gridTemplateColumns: `repeat(${weekCount}, ${cellSize}px)`, gridTemplateRows: `repeat(7, ${cellSize}px)`, gap: `${gap}px`, width: gridWidth }}
                role="img"
                aria-label={`Activity for the past year; ${totalActivity} days with activity; current streak ${progress.streak} days`}
              >
                {Array.from({ length: 7 * weekCount }, (_, i) => {
                  const col = Math.floor(i / 7);
                  const row = i % 7;
                  const idx = col * 7 + row;
                  const level = idx < yearActivity.length ? yearActivity[idx] : 0;
                  const date = new Date(today);
                  date.setDate(date.getDate() - (364 - 1 - idx));
                  return (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{ width: cellSize, height: cellSize, backgroundColor: HEATMAP_COLORS[level] }}
                      title={idx < yearActivity.length ? `${formatShortDate(date)}: ${level > 0 ? `Level ${level} activity` : 'No activity'}` : undefined}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="heatmap-summary-text">
          A summary of your AI learning activity, modules completed, and challenges attempted. Consistent days build your streak.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card-gray">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={18} className="text-[#333333]" aria-hidden />
              <p className="stat-card-label">Activities in the last year</p>
            </div>
            <p className="stat-card-value">{totalActivity} <span className="stat-card-unit">days</span></p>
            <p className="stat-card-caption">{formatShortDate(lastYearStart)} – {formatShortDate(today)}</p>
          </div>
          <div className="stat-card-gray">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-[#333333]" aria-hidden />
              <p className="stat-card-label">Longest streak</p>
            </div>
            <p className="stat-card-value">{longestStreak} <span className="stat-card-unit">days</span></p>
            <p className="stat-card-caption">Personal best</p>
          </div>
          <div className="stat-card-gray">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={18} className="text-[#333333]" aria-hidden />
              <p className="stat-card-label">Current streak</p>
            </div>
            <p className="stat-card-value stat-card-value-highlight">{progress.streak} <span className="stat-card-unit">days</span></p>
            <p className="stat-card-caption">Keep it up!</p>
          </div>
        </div>
      </section>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'live', label: 'Live & Upcoming', icon: <Radio size={16} /> },
          { id: 'recordings', label: 'Recordings', icon: <Headphones size={16} /> },
          { id: 'qa', label: 'Q&A Archive', icon: <MessageCircle size={16} /> },
          { id: 'coaching', label: '1:1 Coaching', icon: <User size={16} /> },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setOfficeSubTab(id as typeof officeSubTab)}
            className={`tab-button ${officeSubTab === id ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {officePostSession && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="success-message flex items-center gap-3 mb-6">
          <CheckCircle size={24} />
          <p className="font-medium">{officePostSession}</p>
        </motion.div>
      )}

      {officeSubTab === 'live' && (
        <>
          {officeHourLive && (
            <div className="gradient-red-purple rounded-xl p-5 mb-6 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="live-badge">
                  <span className="live-dot" /> LIVE NOW
                </span>
                <button onClick={() => setOfficePostSession('Recording saved. Attendance tracked. Follow-up materials shared.')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-white cursor-pointer shrink-0 text-[#e31937]">
                  <Video size={18} /> Join Session
                </button>
              </div>
              <h3 className="text-lg-semibold text-white m-0">{officeHourLive.title}</h3>
              <p className="text-sm-regular" style={{ opacity: 0.9, margin: 0 }}>{officeHourLive.instructor} · {officeHourLive.attending} attending · {officeHourLive.duration}</p>
            </div>
          )}
          <h2 className="section-title">Upcoming Sessions</h2>
          <div className="space-y-4">
            {officeHourUpcoming.map((s) => (
              <div key={s.id} className="session-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="session-title">{s.title}</h4>
                  {s.description && <p className="session-description">{s.description}</p>}
                  <p className="session-meta mt-2">{s.instructor}{s.role ? ` – ${s.role}` : ''} · {s.date} {s.time} · {s.duration} · {s.attending}</p>
                </div>
                <button onClick={() => setOfficePostSession('Calendar invite sent. Prep materials shared.')} className="btn-primary-purple shrink-0">Register</button>
              </div>
            ))}
          </div>
        </>
      )}

      {officeSubTab === 'recordings' && (
        <>
          <h2 className="section-title">Recordings</h2>
          <p className="section-subtitle">Filter by topic, jump to sections, bookmark moments, take notes, and share with your team.</p>
          <div className="space-y-4">
            {officeHourRecordings.map((rec) => (
              <div key={rec.id} className="session-card">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <h4 className="session-title">{rec.title}</h4>
                    <p className="session-meta">{rec.instructor} · {rec.duration} · {rec.topic}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setOfficePostSession('Recording saved. Notes shared.')} className="px-3 py-1.5 rounded-lg text-sm-medium cursor-pointer btn-primary-purple">Watch</button>
                      <span className="text-xs self-center text-app-hint">Timestamp navigation · Bookmark moments</span>
                    </div>
                    <textarea placeholder="Take notes (saved locally)" value={recordingNotes[rec.id] || ''} onChange={(e) => setRecordingNotes(prev => ({ ...prev, [rec.id]: e.target.value }))} rows={2} className="mt-3 textarea-field" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {officeSubTab === 'qa' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-hint" />
              <input type="text" placeholder="Search questions..." value={qaSearch} onChange={(e) => setQaSearch(e.target.value)} className="input-search" />
            </div>
            <button onClick={() => setAskQuestionOpen(true)} className="btn-primary-purple shrink-0">Ask new question</button>
          </div>
          <h2 className="section-title">Q&A Archive</h2>
          <div className="space-y-3">
            {officeHourQA.filter(q => !qaSearch.trim() || q.question.toLowerCase().includes(qaSearch.toLowerCase()) || q.topic.toLowerCase().includes(qaSearch.toLowerCase())).map((q) => (
              <div key={q.id} className="qa-card">
                <button onClick={() => setQaExpandedId(qaExpandedId === q.id ? null : q.id)} className="w-full text-left flex items-center justify-between gap-2 cursor-pointer">
                  <span className="qa-question">{q.question}</span>
                  <span className="text-xs text-app-muted">{q.upvotes} upvotes · {q.answerCount} answers</span>
                </button>
                <p className="qa-meta">{q.author} · {q.date} · {q.topic}</p>
                {qaExpandedId === q.id && q.answer && (
                  <div className="mt-4 pt-4 border-t border-app">
                    <p className="qa-answer-label">Expert answer</p>
                    <p className="qa-answer-text">{q.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {askQuestionOpen && (
            <div className="modal-backdrop">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
                <h3 className="text-lg-semibold text-app-primary mb-3">Ask a question</h3>
                <textarea placeholder="Your question..." rows={4} className="textarea-modal mb-4" />
                <input type="text" placeholder="Topic" className="input-modal mb-4" />
                <div className="flex gap-3">
                  <button onClick={() => setAskQuestionOpen(false)} className="btn-secondary-border">Cancel</button>
                  <button onClick={() => { setAskQuestionOpen(false); setOfficePostSession('Question submitted. Community discussion and expert answers coming soon.'); }} className="btn-primary-purple">Submit</button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}

      {officeSubTab === 'coaching' && (
        <>
          <h2 className="section-title">Book 1:1 Coaching</h2>
          <p className="section-subtitle">Select a slot, choose your mentor, and describe your topic. We'll send a calendar invite and prep materials.</p>
          <div className="space-y-4 mb-6">
            {officeHourSlots.map((slot) => (
              <div key={slot.id} className="session-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-base-semibold text-app-primary">{slot.mentorName}{slot.mentorRole ? ` – ${slot.mentorRole}` : ''}</p>
                  <p className="text-sm-regular text-app-muted">{slot.date} at {slot.time}</p>
                </div>
                <button onClick={() => { setBookedSlotId(slot.id); setOfficePostSession('Calendar invite sent. Prep materials shared.'); }} disabled={bookedSlotId === slot.id} className="btn-primary-purple shrink-0 disabled:opacity-60">{bookedSlotId === slot.id ? 'Booked' : 'Book slot'}</button>
              </div>
            ))}
          </div>
          <div>
            <label className="heading-sm block mb-2">Describe your topic (optional)</label>
            <textarea value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} placeholder="What would you like to focus on?" rows={3} className="textarea-field" />
          </div>
        </>
      )}
    </div>
  );
}
