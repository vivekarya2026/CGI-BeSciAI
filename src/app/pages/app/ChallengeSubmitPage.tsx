/**
 * Challenge Submit Page — Phase 3: 5 submission methods, reflection (4 questions), quality check.
 * Route: /app/learn/challenges/:challengeId/submit
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, Code, Link2, Image, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { getChallengeById } from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { useChallengeTour } from '../../context/ChallengeTourContext';

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
  const { showChallengeTour, currentStepId } = useChallengeTour();
  const demoSubmitEnabled = showChallengeTour && currentStepId === 'submit-button';
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
      <div className="font-primary p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-brand-primary">Back to Learn</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(`/app/learn/challenges/${challengeId}/workspace`)} className="back-button">
        <ArrowLeft size={16} /> Back to workspace
      </button>

      <h1 className="heading-xl">Submit your work</h1>
      <p className="text-body mb-6">{challenge.title}</p>

      {/* 5 submission methods */}
      <div className="space-y-6 mb-8">
        <div
          className="card-surface rounded-xl"
          data-tour-id="submit-upload"
        >
          <h3 className="flex items-center gap-2 mb-3 heading-sm"><Upload size={18} /> Upload files</h3>
          <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-app-secondary" />
          {uploadedFiles.length > 0 && <p className="text-xs text-app-muted mt-2">{uploadedFiles.length} file(s) selected</p>}
        </div>

        <div
          className="card-surface rounded-xl"
          data-tour-id="submit-paste-code"
        >
          <h3 className="flex items-center gap-2 mb-3 heading-sm"><Code size={18} /> Paste code</h3>
          <textarea value={pastedCode} onChange={e => setPastedCode(e.target.value)} placeholder="Paste code or snippets here..." rows={5} className="textarea-code" />
        </div>

        <div
          className="card-surface rounded-xl"
          data-tour-id="submit-link-work"
        >
          <h3 className="flex items-center gap-2 mb-3 heading-sm"><Link2 size={18} /> Link work</h3>
          <input type="url" value={workLink} onChange={e => setWorkLink(e.target.value)} placeholder="https://..." className="input-field" />
        </div>

        <div
          className="card-surface rounded-xl"
          data-tour-id="submit-screenshot"
        >
          <h3 className="flex items-center gap-2 mb-3 heading-sm"><Image size={18} /> Screenshot</h3>
          <div onPaste={handleScreenshotPaste} className="upload-zone">
            {screenshot ? <img src={screenshot} alt="Screenshot" className="max-h-48 mx-auto rounded" /> : <p className="text-sm text-app-hint">Paste an image (Ctrl+V) or drag and drop</p>}
            {screenshot && <button type="button" onClick={() => setScreenshot(null)} className="mt-2 text-sm cursor-pointer link-danger">Remove</button>}
          </div>
        </div>

        <div
          className="card-surface rounded-xl"
          data-tour-id="submit-reflection-notes"
        >
          <h3 className="flex items-center gap-2 mb-3 heading-sm"><FileText size={18} /> Reflection notes</h3>
          <textarea value={reflectionNotes} onChange={e => setReflectionNotes(e.target.value)} placeholder="Add any context or notes about your submission..." rows={3} className="textarea-field" />
        </div>
      </div>

      {/* Add reflection — 4 questions (optional) */}
      <div
        className="card-surface rounded-xl mb-8"
        data-tour-id="submit-reflection-questions"
      >
        <button onClick={() => setShowReflection(!showReflection)} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span className="heading-sm">Add reflection (optional)</span>
          {showReflection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showReflection && (
          <div className="mt-4 space-y-4">
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={i}>
                <label className="text-body-sm font-medium">{q}</label>
                <textarea value={reflectionAnswers[i] ?? ''} onChange={e => setReflectionAnswers(prev => ({ ...prev, [i]: e.target.value }))} rows={2} className="textarea-field mt-1" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quality check */}
      <div
        className="card-surface rounded-xl mb-8"
        data-tour-id="submit-review"
      >
        <h3 className="heading-md">Review your submission</h3>
        <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-app-secondary">
          {uploadedFiles.length > 0 && <li>{uploadedFiles.length} file(s) attached</li>}
          {pastedCode.trim() && <li>Code pasted</li>}
          {workLink.trim() && <li>Link provided</li>}
          {screenshot && <li>Screenshot attached</li>}
          {reflectionNotes.trim() && <li>Reflection notes added</li>}
        </ul>
        {!hasAnySubmission && <p className="text-body-sm text-app-hint">Add at least one submission method above.</p>}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={() => setReviewPassed(true)} 
            disabled={!hasAnySubmission} 
            className={clsx(
              "px-4 py-2 rounded-lg font-semibold cursor-pointer disabled:opacity-50",
              reviewPassed === true ? "btn-review-good-active" : "btn-review-good"
            )}
          >
            Looks good
          </button>
          <button onClick={() => setReviewPassed(false)} className="px-4 py-2 rounded-lg cursor-pointer font-semibold btn-border-strong">I want to revise</button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={(!hasAnySubmission || reviewPassed !== true || submitting) && !demoSubmitEnabled}
        className="w-full py-4 rounded-xl font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-brand-primary"
        data-tour-id="submit-button"
      >
        {submitting ? 'Submitting...' : 'Submit Challenge'}
      </button>
    </div>
  );
}
