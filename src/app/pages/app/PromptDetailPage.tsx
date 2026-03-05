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
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Prompt not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
          Back to Learn
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
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate('/app/learn')} className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer" style={{ color: 'var(--app-text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Learn
      </button>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>{prompt.title}</h1>
        <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>{prompt.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{prompt.category}</span>
          {prompt.tags.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-muted)' }}>{t}</span>)}
        </div>
        <div className="flex items-center gap-4 text-sm mb-6" style={{ color: 'var(--app-text-muted)' }}>
          <span>★ {displayRating} · {prompt.uses.toLocaleString()} uses</span>
          <span>by {prompt.author}</span>
        </div>

        {prompt.useCase && (
          <div className="mb-6">
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Use case</h3>
            <p style={{ fontSize: 14, color: 'var(--app-text-secondary)' }}>{prompt.useCase}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Template</h3>
          <pre className="p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-primary)', border: '1px solid var(--app-border)' }}>
            {prompt.templateText}
          </pre>
        </div>

        {prompt.examples && prompt.examples.length > 0 && (
          <div className="mb-6">
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Success examples</h3>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
              {prompt.examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
        )}

        {prompt.tools && prompt.tools.length > 0 && (
          <div className="mb-6">
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Tool compatibility</h3>
            <p style={{ fontSize: 14, color: 'var(--app-text-secondary)' }}>{prompt.tools.join(', ')}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--app-border)' }}>
          <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied' : 'Copy to clipboard'}
          </button>
          <button onClick={() => { setCustomModal(true); setCustomText(prompt.templateText); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
            <Edit3 size={18} /> Customize & Save
          </button>
          <button onClick={handleBookmark} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: saved ? '#5236ab' : 'var(--app-border-strong)', color: saved ? '#5236ab' : 'var(--app-text-secondary)' }}>
            <Bookmark size={18} fill={saved ? '#5236ab' : 'none'} /> {saved ? 'Saved' : 'Bookmark'}
          </button>
          <button onClick={() => setRateModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <Star size={18} /> Rate & Comment
          </button>
          <button onClick={() => navigate('/app/learn', { state: { tab: 'challenges', prefillPrompt: promptId } })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <Target size={18} /> Apply in Challenge
          </button>
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Similar prompts</h2>
          <ul className="space-y-2">
            {similar.map(p => (
              <li key={p.id}>
                <button onClick={() => navigate('/app/learn/prompts/' + p.id)} className="text-sm font-medium cursor-pointer" style={{ color: '#5236ab' }}>
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {customModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Customize & Save</h3>
            <textarea value={customText} onChange={e => setCustomText(e.target.value)} rows={8} className="w-full p-3 rounded-lg text-sm resize-y mb-4 outline-none" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
            <div className="flex gap-3">
              <button onClick={handleSaveCustom} className="px-4 py-2 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Save as personal</button>
              <button onClick={() => { setCustomModal(false); setCustomText(''); }} className="px-4 py-2 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {rateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Rate & Comment</h3>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)} className="p-1 cursor-pointer" style={{ color: s <= rating ? '#f59e0b' : 'var(--app-text-hint)' }}>
                  <Star size={28} fill={s <= rating ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment" rows={3} className="w-full p-3 rounded-lg text-sm mb-4 outline-none" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
            <div className="flex gap-3">
              <button onClick={handleSubmitRating} className="px-4 py-2 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Submit</button>
              <button onClick={() => { setRateModal(false); setRating(0); setComment(''); }} className="px-4 py-2 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
