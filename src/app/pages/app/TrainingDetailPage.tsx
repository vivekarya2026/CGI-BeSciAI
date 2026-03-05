/**
 * Training Detail Page — Course info + Enroll / Preview / Bookmark.
 * Route: /app/learn/trainings/:trainingId
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Play, Bookmark, Clock, GraduationCap, Target, FileText, Award,
  ChevronDown, ChevronUp, Video, ThumbsUp,
} from 'lucide-react';
import {
  getTrainingById,
  isTrainingSaved,
  toggleTrainingSaved,
} from '../../data/learnData';

export default function TrainingDetailPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => (trainingId ? isTrainingSaved(trainingId) : false));
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const training = useMemo(() => (trainingId ? getTrainingById(trainingId) : undefined), [trainingId]);

  if (!trainingId || !training) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Training not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
          Back to Learn
        </button>
      </div>
    );
  }

  const handleBookmark = () => {
    const nowSaved = toggleTrainingSaved(training.id);
    setSaved(nowSaved);
    setToast(nowSaved ? 'Saved for later' : 'Removed from saved');
    setTimeout(() => setToast(null), 2000);
  };

  const handleEnroll = () => {
    navigate(`/app/learn/trainings/${training.id}/start`);
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/learn')}
        className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer"
        style={{ color: 'var(--app-text-secondary)' }}
      >
        <ArrowLeft size={16} /> Back to Learn
      </button>

      <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>{training.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {training.format && <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}>{training.format}</span>}
          {training.difficulty && <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{training.difficulty}</span>}
          <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-muted)' }}>{training.category}</span>
        </div>

        <p style={{ fontSize: 15, lineHeight: '22px', color: 'var(--app-text-secondary)', marginBottom: 20 }}>{training.description}</p>

        {/* 8 items: objectives, duration, prerequisites, progress, auto-tracking, certificate, syllabus, intro video, reviews */}
        <div className="grid gap-4 mb-6">
          <div className="flex items-start gap-2">
            <Clock size={18} style={{ color: 'var(--app-text-muted)', marginTop: 2 }} />
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase' }}>Duration</span>
              <p style={{ fontSize: 14, color: 'var(--app-text-primary)' }}>{training.duration} · {training.lessons} lessons</p>
            </div>
          </div>
          {training.progress != null && (
            <div className="flex items-start gap-2">
              <Target size={18} style={{ color: 'var(--app-text-muted)', marginTop: 2 }} />
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase' }}>Progress</span>
                <p style={{ fontSize: 14, color: 'var(--app-text-primary)' }}>{training.progress}% complete · Auto-tracking enabled</p>
              </div>
            </div>
          )}
          {training.objectives && training.objectives.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Learning objectives</h3>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                {training.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}
          {training.prerequisites && training.prerequisites.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                {training.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {training.certificateInfo && (
            <div className="flex items-start gap-2">
              <Award size={18} style={{ color: 'var(--app-text-muted)', marginTop: 2 }} />
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase' }}>Certificate</span>
                <p style={{ fontSize: 14, color: 'var(--app-text-primary)' }}>{training.certificateInfo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Decision: Enroll / Preview / Bookmark */}
        <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--app-border)' }}>
          <button onClick={handleEnroll} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
            <Play size={18} /> Enroll & Start Training
          </button>
          <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
            <FileText size={18} /> Preview Content
          </button>
          <button onClick={handleBookmark} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: saved ? '#5236ab' : 'var(--app-border-strong)', color: saved ? '#5236ab' : 'var(--app-text-secondary)' }}>
            <Bookmark size={18} fill={saved ? '#5236ab' : 'none'} /> {saved ? 'Saved' : 'Save for Later'}
          </button>
        </div>

        {/* Preview: syllabus, intro video, reviews */}
        {showPreview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t space-y-4" style={{ borderColor: 'var(--app-border)' }}>
            {training.syllabus && training.syllabus.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Syllabus</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                  {training.syllabus.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            )}
            {training.introVideoUrl && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Intro video</h3>
                <div className="rounded-lg overflow-hidden aspect-video max-w-md bg-black/10 flex items-center justify-center">
                  <a href={training.introVideoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#5236ab' }}>
                    <Video size={18} /> Watch intro
                  </a>
                </div>
              </div>
            )}
            {training.reviews && training.reviews.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Reviews</h3>
                <ul className="space-y-2">
                  {training.reviews.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                      <ThumbsUp size={14} style={{ color: '#f59e0b', marginTop: 2 }} />
                      <span>{r.rating}/5 — {r.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
