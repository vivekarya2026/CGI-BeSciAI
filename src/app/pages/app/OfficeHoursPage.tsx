/**
 * Office Hours — standalone page: contributions/streak section + Live & Upcoming, Recordings, Q&A, 1:1 Coaching.
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock, Radio, Headphones, MessageCircle, User, Video, Search, CheckCircle,
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
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Office Hours</h1>
      <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px', marginBottom: 24 }}>
        Join live sessions, watch recordings, browse Q&A, or book 1:1 coaching.
      </p>

      {/* Contributions-style section (GitHub-like): heatmap + legend + summary cards — per guidelines */}
      <section aria-label="Contributions and learning activity" className="rounded-xl mb-6 p-5 sm:p-6" style={{ backgroundColor: '#ffffff', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.2)', border: '1px solid var(--app-border)', borderRadius: 8 }}>
        <h2 className="text-lg sm:text-xl" style={{ fontWeight: 400, color: '#333333', marginBottom: 16 }}>Contributions</h2>

        {/* Heatmap: horizontal scroll on narrow viewports (mobile-first), full width on desktop */}
        <div
          className="w-full max-w-full overflow-x-auto overflow-y-hidden"
          style={{ WebkitOverflowScrolling: 'touch', marginLeft: -4, marginRight: -4 }}
          aria-label="Scroll to see full year"
        >
          <div className="flex flex-col shrink-0" style={{ minWidth: heatmapBlockMinWidth }}>
            {/* Month labels row — aligned above grid */}
            <div className="flex items-center mb-1" style={{ marginLeft: labelWidth + labelGap, width: gridWidth, position: 'relative', height: 16 }}>
              {monthStarts.map(({ month, col }) => (
                <span key={`${month}-${col}`} style={{ position: 'absolute', left: col * colWidth, fontSize: 12, color: '#5c5c5c', whiteSpace: 'nowrap' }}>{month}</span>
              ))}
            </div>

            <div className="flex gap-2" style={{ gap: labelGap }}>
              {/* Day-of-week labels */}
              <div className="flex flex-col justify-around shrink-0" style={{ width: labelWidth, fontSize: 12, color: '#5c5c5c', lineHeight: 1.4, marginTop: 2 }}>
                {[0, 2, 4, 6].map(r => (
                  <span key={r}>{dayLabels[r]}</span>
                ))}
              </div>
              {/* 7 rows × 53 cols heatmap */}
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

        {/* Legend: Less [squares] More — wraps on very narrow screens */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-4 sm:mb-6" style={{ fontSize: 12, color: '#5c5c5c' }}>
          <span>Less</span>
          {HEATMAP_COLORS.map((color, i) => (
            <div key={i} className="rounded-sm shrink-0" style={{ width: 10, height: 10, backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>

        <p className="text-sm" style={{ color: '#5c5c5c', lineHeight: '17px', marginBottom: 20 }}>
          Learning activity from Office Hours, trainings, and challenges. Consistent days build your streak.
        </p>

        {/* Summary cards: Activity in last year, Longest streak, Current streak */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg p-4 sm:p-5" style={{ backgroundColor: '#efefef', border: '1px solid #a8a8a8' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 4 }}>Activity in the last year</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#333333', lineHeight: '24px' }}>{totalActivity} <span style={{ fontSize: 14, fontWeight: 400 }}>days</span></p>
            <p style={{ fontSize: 12, color: '#5c5c5c', lineHeight: '16px', marginTop: 4 }}>{formatShortDate(lastYearStart)} – {formatShortDate(today)}</p>
          </div>
          <div className="rounded-lg p-4 sm:p-5" style={{ backgroundColor: '#efefef', border: '1px solid #a8a8a8' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 4 }}>Longest streak</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#333333', lineHeight: '24px' }}>{longestStreak} <span style={{ fontSize: 14, fontWeight: 400 }}>days</span></p>
            <p style={{ fontSize: 12, color: '#5c5c5c', lineHeight: '16px', marginTop: 4 }}>Best consecutive run</p>
          </div>
          <div className="rounded-lg p-4 sm:p-5" style={{ backgroundColor: '#efefef', border: '1px solid #a8a8a8' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 4 }}>Current streak</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#5236ab', lineHeight: '24px' }}>{progress.streak} <span style={{ fontSize: 14, fontWeight: 400, color: '#333333' }}>days</span></p>
            <p style={{ fontSize: 12, color: '#5c5c5c', lineHeight: '16px', marginTop: 4 }}>{formatShortDate(currentStreakStart)} – {formatShortDate(today)}</p>
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap cursor-pointer"
            style={{
              backgroundColor: officeSubTab === id ? '#5236ab' : 'var(--app-surface)',
              color: officeSubTab === id ? 'white' : 'var(--app-text-secondary)',
              border: officeSubTab === id ? 'none' : '1px solid var(--app-border-strong)',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {officePostSession && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
          <CheckCircle size={24} />
          <p className="font-medium">{officePostSession}</p>
        </motion.div>
      )}

      {officeSubTab === 'live' && (
        <>
          {officeHourLive && (
            <div className="rounded-xl p-5 mb-6 flex flex-col gap-3" style={{ background: 'linear-gradient(135deg, #e31937 0%, #a82465 100%)', color: 'white' }}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NOW
                </span>
                <button onClick={() => setOfficePostSession('Recording saved. Attendance tracked. Follow-up materials shared.')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-white text-[#e31937] cursor-pointer shrink-0">
                  <Video size={18} /> Join Session
                </button>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>{officeHourLive.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>{officeHourLive.instructor} · {officeHourLive.attending} attending · {officeHourLive.duration}</p>
            </div>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {officeHourUpcoming.map((s) => (
              <div key={s.id} className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                <div className="flex-1">
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>{s.title}</h4>
                  {s.description && <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginTop: 4 }}>{s.description}</p>}
                  <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 8 }}>{s.instructor}{s.role ? ` – ${s.role}` : ''} · {s.date} {s.time} · {s.duration} · {s.attending}</p>
                </div>
                <button onClick={() => setOfficePostSession('Calendar invite sent. Prep materials shared.')} className="px-4 py-2 rounded-lg font-semibold cursor-pointer shrink-0" style={{ backgroundColor: '#5236ab', color: 'white' }}>Register</button>
              </div>
            ))}
          </div>
        </>
      )}

      {officeSubTab === 'recordings' && (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Recordings</h2>
          <p style={{ fontSize: 14, color: 'var(--app-text-muted)', marginBottom: 16 }}>Filter by topic, jump to sections, bookmark moments, take notes, and share with your team.</p>
          <div className="space-y-4">
            {officeHourRecordings.map((rec) => (
              <div key={rec.id} className="rounded-xl p-5" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>{rec.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 4 }}>{rec.instructor} · {rec.duration} · {rec.topic}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setOfficePostSession('Recording saved. Notes shared.')} className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Watch</button>
                      <span className="text-xs self-center" style={{ color: 'var(--app-text-hint)' }}>Timestamp navigation · Bookmark moments</span>
                    </div>
                    <textarea placeholder="Take notes (saved locally)" value={recordingNotes[rec.id] || ''} onChange={(e) => setRecordingNotes(prev => ({ ...prev, [rec.id]: e.target.value }))} rows={2} className="mt-3 w-full p-3 rounded-lg text-sm outline-none resize-y" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
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
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
              <input type="text" placeholder="Search questions..." value={qaSearch} onChange={(e) => setQaSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg outline-none" style={{ fontSize: 16, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }} />
            </div>
            <button onClick={() => setAskQuestionOpen(true)} className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold cursor-pointer shrink-0" style={{ backgroundColor: '#5236ab', color: 'white' }}>Ask new question</button>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Q&A Archive</h2>
          <div className="space-y-3">
            {officeHourQA.filter(q => !qaSearch.trim() || q.question.toLowerCase().includes(qaSearch.toLowerCase()) || q.topic.toLowerCase().includes(qaSearch.toLowerCase())).map((q) => (
              <div key={q.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <button onClick={() => setQaExpandedId(qaExpandedId === q.id ? null : q.id)} className="w-full text-left flex items-center justify-between gap-2 cursor-pointer">
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>{q.question}</span>
                  <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{q.upvotes} upvotes · {q.answerCount} answers</span>
                </button>
                <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 4 }}>{q.author} · {q.date} · {q.topic}</p>
                {qaExpandedId === q.id && q.answer && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--app-border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 6 }}>Expert answer</p>
                    <p style={{ fontSize: 14, color: 'var(--app-text-secondary)' }}>{q.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {askQuestionOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Ask a question</h3>
                <textarea placeholder="Your question..." rows={4} className="w-full p-3 rounded-lg text-sm mb-4 outline-none resize-y" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
                <input type="text" placeholder="Topic" className="w-full px-4 py-2 rounded-lg outline-none text-sm mb-4" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
                <div className="flex gap-3">
                  <button onClick={() => setAskQuestionOpen(false)} className="px-4 py-2 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>Cancel</button>
                  <button onClick={() => { setAskQuestionOpen(false); setOfficePostSession('Question submitted. Community discussion and expert answers coming soon.'); }} className="px-4 py-2 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Submit</button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}

      {officeSubTab === 'coaching' && (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Book 1:1 Coaching</h2>
          <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 16 }}>Select a slot, choose your mentor, and describe your topic. We'll send a calendar invite and prep materials.</p>
          <div className="space-y-4 mb-6">
            {officeHourSlots.map((slot) => (
              <div key={slot.id} className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>{slot.mentorName}{slot.mentorRole ? ` – ${slot.mentorRole}` : ''}</p>
                  <p style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{slot.date} at {slot.time}</p>
                </div>
                <button onClick={() => { setBookedSlotId(slot.id); setOfficePostSession('Calendar invite sent. Prep materials shared.'); }} disabled={bookedSlotId === slot.id} className="px-4 py-2 rounded-lg font-semibold cursor-pointer shrink-0 disabled:opacity-60" style={{ backgroundColor: '#5236ab', color: 'white' }}>{bookedSlotId === slot.id ? 'Booked' : 'Book slot'}</button>
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)', display: 'block', marginBottom: 8 }}>Describe your topic (optional)</label>
            <textarea value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} placeholder="What would you like to focus on?" rows={3} className="w-full p-3 rounded-lg text-sm outline-none resize-y" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
          </div>
        </>
      )}
    </div>
  );
}
