/**
 * Prompt Detail Page — full template + Copy / Customize & Save / Bookmark / Rate / Apply in Challenge.
 * Route: /app/learn/prompts/:promptId
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Copy, Bookmark, Star, MessageCircle, Target, Edit3, Check,
} from 'lucide-react';
import clsx from 'clsx';
import {
  getPromptById,
  isPromptSaved,
  togglePromptSaved,
  setPromptRating,
  getPromptUserRating,
  promptLibrary,
} from '../../data/learnData';

export default function PromptDetailPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => (promptId ? isPromptSaved(promptId) : false));
  const [copied, setCopied] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [rateModal, setRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const prompt = useMemo(() => (promptId ? getPromptById(promptId) : undefined), [promptId]);
  const userRating = useMemo(() => (promptId ? getPromptUserRating(promptId) : undefined), [promptId]);

  if (!promptId || !prompt) {
    return (
      <div className="font-primary p-6">
        <p className="text-app-secondary">Prompt not found.</p>
        <button onClick={() => navigate('/app/prompt-library')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-brand-primary">
          Back to Prompt Library
        </button>
      </div>
    );
  }

  const displayRating = userRating?.rating ?? prompt.rating;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.templateText);
      setCopied(true);
      setToast('Copied to clipboard. Paste in your AI tool.');
      setTimeout(() => { setCopied(false); setToast(null); }, 2500);
    } catch {
      setToast('Copy failed');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleBookmark = () => {
    const now = togglePromptSaved(prompt.id);
    setSaved(now);
    setToast(now ? 'Bookmarked' : 'Removed from saved');
    setTimeout(() => setToast(null), 2000);
  };

  const handleSaveCustom = () => {
    if (customText.trim()) {
      try {
        const raw = localStorage.getItem('learn_custom_prompts') || '[]';
        const arr = JSON.parse(raw);
        arr.push({ id: 'custom-' + Date.now(), title: prompt.title + ' (custom)', templateText: customText, baseId: prompt.id });
        localStorage.setItem('learn_custom_prompts', JSON.stringify(arr));
        setToast('Saved as personal variation');
        setCustomModal(false);
        setCustomText('');
      } catch {
        setToast('Save failed');
      }
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSubmitRating = () => {
    setPromptRating(prompt.id, rating, comment);
    setToast('Thanks for your feedback');
    setRateModal(false);
    setRating(0);
    setComment('');
    setTimeout(() => setToast(null), 2000);
  };

  const similar = promptLibrary.filter(p => p.id !== prompt.id && p.category === prompt.category).slice(0, 3);

  return (
    <div className="page-container-wide">
      <button onClick={() => navigate('/app/prompt-library')} className="back-button">
        <ArrowLeft size={16} /> Back to Prompt Library
      </button>

      <div className="card-surface-shadow rounded-xl p-6 mb-6">
        <h1 className="heading-xl">{prompt.title}</h1>
        <p className="text-body mb-4">{prompt.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-base badge-tab-bg">{prompt.category}</span>
          {prompt.tags.slice(0, 4).map(t => <span key={t} className="badge-base badge-tab-muted">{t}</span>)}
        </div>
        <div className="flex items-center gap-4 text-sm mb-6 text-app-muted">
          <span>★ {displayRating} · {prompt.uses.toLocaleString()} uses</span>
          <span>by {prompt.author}</span>
        </div>

        {prompt.useCase && (
          <div className="mb-6">
            <h3 className="text-caption mb-1.5">Use case</h3>
            <p className="text-body-sm">{prompt.useCase}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-caption mb-2">Template</h3>
          <pre className="code-block">
            {prompt.templateText}
          </pre>
        </div>

        {prompt.examples && prompt.examples.length > 0 && (
          <div className="mb-6">
            <h3 className="text-caption mb-2">Success examples</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary">
              {prompt.examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
        )}

        {prompt.tools && prompt.tools.length > 0 && (
          <div className="mb-6">
            <h3 className="text-caption mb-2">Tool compatibility</h3>
            <p className="text-body-sm">{prompt.tools.join(', ')}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-app">
          <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer btn-brand-primary">
            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied' : 'Copy to clipboard'}
          </button>
          <button onClick={() => { setCustomModal(true); setCustomText(prompt.templateText); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer btn-brand-secondary">
            <Edit3 size={18} /> Customize & Save
          </button>
          <button 
            onClick={handleBookmark} 
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border",
              saved ? "btn-border-brand" : "btn-border-strong"
            )}
          >
            <Bookmark size={18} fill={saved ? '#5236ab' : 'none'} /> {saved ? 'Saved' : 'Bookmark'}
          </button>
          <button onClick={() => setRateModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer btn-border-strong">
            <Star size={18} /> Rate & Comment
          </button>
          <button onClick={() => navigate('/app/learn', { state: { tab: 'challenges', prefillPrompt: promptId } })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer btn-border-strong">
            <Target size={18} /> Apply in Challenge
          </button>
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <h2 className="heading-md">Similar prompts</h2>
          <ul className="space-y-2">
            {similar.map(p => (
              <li key={p.id}>
                <button onClick={() => navigate('/app/learn/prompts/' + p.id)} className="text-sm font-medium cursor-pointer link-brand">
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {customModal && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content modal-content-lg">
            <h3 className="heading-md">Customize & Save</h3>
            <textarea value={customText} onChange={e => setCustomText(e.target.value)} rows={8} className="textarea-field resize-y mb-4" />
            <div className="flex gap-3">
              <button onClick={handleSaveCustom} className="px-4 py-2 rounded-lg font-semibold cursor-pointer btn-brand-primary">Save as personal</button>
              <button onClick={() => { setCustomModal(false); setCustomText(''); }} className="px-4 py-2 rounded-lg font-semibold cursor-pointer btn-border-strong">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {rateModal && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <h3 className="heading-md">Rate & Comment</h3>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(s => (
                <button 
                  key={s} 
                  onClick={() => setRating(s)} 
                  className={clsx("p-1 cursor-pointer", s <= rating ? "star-rating-active" : "star-rating-inactive")}
                >
                  <Star size={28} fill={s <= rating ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment" rows={3} className="textarea-field mb-4" />
            <div className="flex gap-3">
              <button onClick={handleSubmitRating} className="px-4 py-2 rounded-lg font-semibold cursor-pointer btn-brand-primary">Submit</button>
              <button onClick={() => { setRateModal(false); setRating(0); setComment(''); }} className="px-4 py-2 rounded-lg font-semibold cursor-pointer btn-border-strong">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}
