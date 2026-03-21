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
      <div className="font-primary p-6">
        <p className="text-app-secondary">Resource not found.</p>
        <button onClick={() => navigate('/app/resources')} className="mt-4 btn-primary-purple">
          Back to Resources
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
    <div className="page-container-wide">
      <button onClick={() => navigate('/app/resources')} className="btn-link-back">
        <ArrowLeft size={16} /> Back to Resources
      </button>

      <div className="card-detail">
        <h1 className="card-detail-title">{resource.title}</h1>
        <p className="card-detail-desc">{resource.desc}</p>
        <div className="flex flex-wrap gap-2 mb-6 card-detail-meta">
          <span className="capitalize">{resource.type}</span>
          <span>·</span>
          <span>{resource.duration}</span>
          {resource.date && <><span>·</span><span>{resource.date}</span></>}
        </div>

        {resource.body && (
          <div className="card-content-section">
            <h3 className="card-content-title">Read guide</h3>
            <div className="prose prose-sm max-w-none card-content-body">{resource.body}</div>
          </div>
        )}

        {resource.embedUrl && (
          <div className="mb-6 rounded-lg overflow-hidden aspect-video bg-app-bg">
            <iframe title={resource.title} src={resource.embedUrl} className="w-full h-full" allowFullScreen />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {resource.downloadUrl && (
            <a href={resource.downloadUrl} download className="btn-primary-purple no-underline">
              <Download size={18} /> Download PDF
            </a>
          )}
          <button onClick={handleBookmark} className={`btn-secondary-border ${saved ? 'btn-secondary-border-saved' : ''}`}>
            <Bookmark size={18} fill={saved ? 'var(--cgi-purple)' : 'none'} /> {saved ? 'Saved' : 'Bookmark'}
          </button>
          <button onClick={handleShare} className="btn-secondary-border">
            <Share2 size={18} /> Share with team
          </button>
        </div>

        <h3 className="heading-sm mb-3">Apply learning</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleReferenceInWork} className="btn-secondary-border">
            <Link2 size={18} /> Reference in work
          </button>
          <button onClick={() => navigate('/app/community', { state: { shareResource: resourceId } })} className="btn-secondary-border">
            <Users size={18} /> Share in community
          </button>
          <button onClick={() => navigate('/app/learn', { state: { tab: 'challenges', fromResource: resourceId } })} className="btn-secondary-border">
            <Target size={18} /> Use in challenge
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}
