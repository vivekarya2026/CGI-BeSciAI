/**
 * Resource Detail Page — Read / Download / Bookmark / Share + Apply Learning.
 * Route: /app/learn/resources/:resourceId
 */

import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, BookOpen, Download, Bookmark, Share2, Target, Link2, Users,
} from 'lucide-react';
import {
  getResourceById,
  isResourceSaved,
  toggleResourceSaved,
} from '../../data/learnData';

export default function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => (resourceId ? isResourceSaved(resourceId) : false));
  const [toast, setToast] = useState<string | null>(null);

  const resource = useMemo(() => (resourceId ? getResourceById(resourceId) : undefined), [resourceId]);

  if (!resourceId || !resource) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Resource not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
          Back to Learn
        </button>
      </div>
    );
  }

  const handleBookmark = () => {
    const now = toggleResourceSaved(resource.id);
    setSaved(now);
    setToast(now ? 'Bookmarked' : 'Removed from saved');
    setTimeout(() => setToast(null), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: resource.title, url });
        setToast('Shared');
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied to clipboard');
      }
    } catch {
      setToast('Share failed');
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleReferenceInWork = () => {
    setToast('Tip: Use this resource when drafting. Link copied to clipboard.');
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate('/app/learn')} className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer" style={{ color: 'var(--app-text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Learn
      </button>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>{resource.title}</h1>
        <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>{resource.desc}</p>
        <div className="flex flex-wrap gap-2 mb-6 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          <span className="capitalize">{resource.type}</span>
          <span>·</span>
          <span>{resource.duration}</span>
          {resource.date && <><span>·</span><span>{resource.date}</span></>}
        </div>

        {resource.body && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)' }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Read guide</h3>
            <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap" style={{ color: 'var(--app-text-secondary)' }}>{resource.body}</div>
          </div>
        )}

        {resource.embedUrl && (
          <div className="mb-6 rounded-lg overflow-hidden aspect-video" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
            <iframe title={resource.title} src={resource.embedUrl} className="w-full h-full" allowFullScreen />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {resource.downloadUrl && (
            <a href={resource.downloadUrl} download className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white', textDecoration: 'none' }}>
              <Download size={18} /> Download PDF
            </a>
          )}
          <button onClick={handleBookmark} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: saved ? '#5236ab' : 'var(--app-border-strong)', color: saved ? '#5236ab' : 'var(--app-text-secondary)' }}>
            <Bookmark size={18} fill={saved ? '#5236ab' : 'none'} /> {saved ? 'Saved' : 'Bookmark'}
          </button>
          <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <Share2 size={18} /> Share with team
          </button>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Apply learning</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleReferenceInWork} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
            <Link2 size={18} /> Reference in work
          </button>
          <button onClick={() => navigate('/app/community', { state: { shareResource: resourceId } })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
            <Users size={18} /> Share in community
          </button>
          <button onClick={() => navigate('/app/learn', { state: { tab: 'challenges', fromResource: resourceId } })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
            <Target size={18} /> Use in challenge
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
