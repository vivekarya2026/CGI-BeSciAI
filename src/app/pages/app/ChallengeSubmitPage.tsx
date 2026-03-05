/**
 * Challenge Submit Page — Phase 3: 5 submission methods, reflection (4 questions), quality check.
 * Route: /app/learn/challenges/:challengeId/submit
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, Code, Link2, Image, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { getChallengeById } from '../../data/learnData';
import { useUser } from '../../context/UserContext';

const REFLECTION_QUESTIONS = [
  'What was the hardest part?',
  'What would you do differently next time?',
  'How did you use AI in this challenge?',
  'What did you learn?',
];

export default function ChallengeSubmitPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pastedCode, setPastedCode] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});
  const [reviewPassed, setReviewPassed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

  const hasAnySubmission = uploadedFiles.length > 0 || pastedCode.trim() !== '' || workLink.trim() !== '' || screenshot !== null || reflectionNotes.trim() !== '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setUploadedFiles(Array.from(files));
  };

  const handleScreenshotPaste = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.files[0];
    if (item && item.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(item);
    }
  };

  const handleSubmit = () => {
    if (!challengeId || !challenge) return;
    setSubmitting(true);
    addXp(challenge.points);
    setTimeout(() => {
      setSubmitting(false);
      navigate(`/app/learn/challenges/${challengeId}/results`);
    }, 800);
  };

  if (!challengeId || !challenge) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Back to Learn</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 700, margin: '0 auto' }}>
      <button onClick={() => navigate(`/app/learn/challenges/${challengeId}/workspace`)} className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer" style={{ color: 'var(--app-text-secondary)' }}>
        <ArrowLeft size={16} /> Back to workspace
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>Submit your work</h1>
      <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 24 }}>{challenge.title}</p>

      {/* 5 submission methods */}
      <div className="space-y-6 mb-8">
        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}><Upload size={18} /> Upload files</h3>
          <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm" style={{ color: 'var(--app-text-secondary)' }} />
          {uploadedFiles.length > 0 && <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 8 }}>{uploadedFiles.length} file(s) selected</p>}
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}><Code size={18} /> Paste code</h3>
          <textarea value={pastedCode} onChange={e => setPastedCode(e.target.value)} placeholder="Paste code or snippets here..." rows={5} className="w-full rounded-lg p-3 outline-none font-mono text-sm" style={{ border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }} />
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}><Link2 size={18} /> Link work</h3>
          <input type="url" value={workLink} onChange={e => setWorkLink(e.target.value)} placeholder="https://..." className="w-full rounded-lg p-3 outline-none" style={{ border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }} />
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}><Image size={18} /> Screenshot</h3>
          <div onPaste={handleScreenshotPaste} className="rounded-lg border-2 border-dashed p-6 text-center" style={{ borderColor: 'var(--app-border-strong)', backgroundColor: 'var(--app-bg)' }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" className="max-h-48 mx-auto rounded" /> : <p style={{ fontSize: 14, color: 'var(--app-text-hint)' }}>Paste an image (Ctrl+V) or drag and drop</p>}
            {screenshot && <button type="button" onClick={() => setScreenshot(null)} className="mt-2 text-sm cursor-pointer" style={{ color: '#e31937' }}>Remove</button>}
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}><FileText size={18} /> Reflection notes</h3>
          <textarea value={reflectionNotes} onChange={e => setReflectionNotes(e.target.value)} placeholder="Add any context or notes about your submission..." rows={3} className="w-full rounded-lg p-3 outline-none" style={{ border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }} />
        </div>
      </div>

      {/* Add reflection — 4 questions (optional) */}
      <div className="rounded-xl p-5 mb-8 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
        <button onClick={() => setShowReflection(!showReflection)} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>Add reflection (optional)</span>
          {showReflection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showReflection && (
          <div className="mt-4 space-y-4">
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={i}>
                <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--app-text-secondary)' }}>{q}</label>
                <textarea value={reflectionAnswers[i] ?? ''} onChange={e => setReflectionAnswers(prev => ({ ...prev, [i]: e.target.value }))} rows={2} className="w-full mt-1 rounded-lg p-3 outline-none text-sm" style={{ border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quality check */}
      <div className="rounded-xl p-5 mb-8 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Review your submission</h3>
        <ul className="list-disc list-inside text-sm space-y-1 mb-4" style={{ color: 'var(--app-text-secondary)' }}>
          {uploadedFiles.length > 0 && <li>{uploadedFiles.length} file(s) attached</li>}
          {pastedCode.trim() && <li>Code pasted</li>}
          {workLink.trim() && <li>Link provided</li>}
          {screenshot && <li>Screenshot attached</li>}
          {reflectionNotes.trim() && <li>Reflection notes added</li>}
        </ul>
        {!hasAnySubmission && <p style={{ fontSize: 14, color: 'var(--app-text-hint)' }}>Add at least one submission method above.</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={() => setReviewPassed(true)} disabled={!hasAnySubmission} className="px-4 py-2 rounded-lg font-semibold cursor-pointer disabled:opacity-50" style={{ backgroundColor: reviewPassed === true ? '#1ab977' : 'var(--app-tab-bg)', color: reviewPassed === true ? 'white' : 'var(--app-text-secondary)' }}>Looks good</button>
          <button onClick={() => setReviewPassed(false)} className="px-4 py-2 rounded-lg border cursor-pointer font-semibold" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>I want to revise</button>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!hasAnySubmission || reviewPassed !== true || submitting} className="w-full py-4 rounded-xl font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#5236ab', color: 'white' }}>
        {submitting ? 'Submitting...' : 'Submit Challenge'}
      </button>
    </div>
  );
}
