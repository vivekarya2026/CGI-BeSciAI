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
import clsx from 'clsx';
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
      <div className="p-6">
        <p className="text-app-secondary">Training not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">
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
    <div className="max-w-[800px] mx-auto">
      <button
        onClick={() => navigate('/app/learn')}
        className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer text-app-secondary"
      >
        <ArrowLeft size={16} /> Back to Learn
      </button>

      <div className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app shadow-[var(--app-shadow)]">
        <h1 className="text-2xl font-bold text-app-primary mb-2">{training.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {training.format && <span className="badge-base badge-purple">{training.format}</span>}
          {training.difficulty && <span className="badge-base badge-gray">{training.difficulty}</span>}
          <span className="badge-base badge-gray text-app-muted">{training.category}</span>
        </div>

        <p className="text-[15px] leading-[22px] text-app-secondary mb-5">{training.description}</p>

        {/* 8 items: objectives, duration, prerequisites, progress, auto-tracking, certificate, syllabus, intro video, reviews */}
        <div className="grid gap-4 mb-6">
          <div className="flex items-start gap-2">
            <Clock size={18} className="text-app-muted mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-app-muted uppercase">Duration</span>
              <p className="text-sm text-app-primary">{training.duration} · {training.lessons} lessons</p>
            </div>
          </div>
          {training.progress != null && (
            <div className="flex items-start gap-2">
              <Target size={18} className="text-app-muted mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-app-muted uppercase">Progress</span>
                <p className="text-sm text-app-primary">{training.progress}% complete · Auto-tracking enabled</p>
              </div>
            </div>
          )}
          {training.objectives && training.objectives.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-1.5">Learning objectives</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary">
                {training.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}
          {training.prerequisites && training.prerequisites.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-1.5">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary">
                {training.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {training.certificateInfo && (
            <div className="flex items-start gap-2">
              <Award size={18} className="text-app-muted mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-app-muted uppercase">Certificate</span>
                <p className="text-sm text-app-primary">{training.certificateInfo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Decision: Enroll / Preview / Bookmark */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-app">
          <button onClick={handleEnroll} className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer">
            <Play size={18} /> Enroll & Start Training
          </button>
          <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer border border-app-strong text-app-primary">
            <FileText size={18} /> Preview Content
          </button>
          <button 
            onClick={handleBookmark} 
            className={clsx(
              "inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer border",
              saved ? "border-cgi-purple text-cgi-purple" : "border-app-strong text-app-secondary"
            )}
          >
            <Bookmark size={18} fill={saved ? 'var(--cgi-purple)' : 'none'} /> {saved ? 'Saved' : 'Save for Later'}
          </button>
        </div>

        {/* Preview: syllabus, intro video, reviews */}
        {showPreview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-app space-y-4">
            {training.syllabus && training.syllabus.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-app-primary mb-2">Syllabus</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-app-secondary">
                  {training.syllabus.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            )}
            {training.introVideoUrl && (
              <div>
                <h3 className="text-sm font-semibold text-app-primary mb-2">Intro video</h3>
                <div className="rounded-lg overflow-hidden aspect-video max-w-md bg-black/10 flex items-center justify-center">
                  <a href={training.introVideoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-cgi-purple">
                    <Video size={18} /> Watch intro
                  </a>
                </div>
              </div>
            )}
            {training.reviews && training.reviews.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-app-primary mb-2">Reviews</h3>
                <ul className="space-y-2">
                  {training.reviews.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-app-secondary">
                      <ThumbsUp size={14} className="text-archetype-trailblazer mt-0.5" />
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
        <div className="card-base fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium bg-app-surface border-app shadow-[var(--app-shadow)]">
          {toast}
        </div>
      )}
    </div>
  );
}
