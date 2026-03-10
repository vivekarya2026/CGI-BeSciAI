/**
 * Prompt Library — standalone page: search, filters, prompt grid, contribute modal.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Bookmark } from 'lucide-react';
import { promptLibrary, isPromptSaved } from '../../data/learnData';
import { useNavigate } from 'react-router';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const [promptSearch, setPromptSearch] = useState('');
  const [promptCategory, setPromptCategory] = useState<string>('all');
  const [promptSavedOnly, setPromptSavedOnly] = useState(false);
  const [contributePromptOpen, setContributePromptOpen] = useState(false);

  const savedPrompts = promptLibrary.filter(p => isPromptSaved(p.id)).length;
  const filteredPrompts = promptLibrary.filter(p => {
    const catOk = promptCategory === 'all' || p.category.toLowerCase() === promptCategory.toLowerCase();
    const searchOk = !promptSearch.trim() || (p.title + p.description + p.tags.join(' ')).toLowerCase().includes(promptSearch.toLowerCase());
    const savedOk = !promptSavedOnly || isPromptSaved(p.id);
    return catOk && searchOk && savedOk;
  });

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Prompt Library</h1>
      <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px', marginBottom: 24 }}>
        Search and browse prompts by category. Copy, customize, bookmark, or apply in a challenge.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
          <input type="text" placeholder="Search prompts by title, tag, or description..." value={promptSearch} onChange={(e) => setPromptSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg outline-none" style={{ fontSize: 16, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }} />
        </div>
        <motion.button
          {...primaryButtonMotion()}
          onClick={() => setContributePromptOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold cursor-pointer shrink-0"
          style={{ backgroundColor: '#5236ab', color: 'white' }}
        >
          + Contribute Prompt
        </motion.button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Category</label>
        <select value={promptCategory} onChange={(e) => setPromptCategory(e.target.value)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 180, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
          <option value="all">All categories</option>
          <option value="communication">Communication</option>
          <option value="data">Data</option>
          <option value="productivity">Productivity</option>
          <option value="development">Development</option>
          <option value="project management">Project Management</option>
          <option value="strategy">Strategy</option>
        </select>
        <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Show</label>
        <select value={promptSavedOnly ? 'saved' : 'all'} onChange={(e) => setPromptSavedOnly(e.target.value === 'saved')} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right flex items-center gap-2" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 140, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
          <option value="all">All prompts</option>
          <option value="saved">My Saved ({savedPrompts})</option>
        </select>
      </div>
      <div className="text-right text-sm mb-4" style={{ color: 'var(--app-text-muted)' }}>{filteredPrompts.length} prompts</div>
      <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((p, i) => (
          <motion.div
            {...cardHoverMotion()}
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(`/app/learn/prompts/${p.id}`)}
            className="rounded-xl p-5 cursor-pointer"
            style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{p.category}</span>
              <div className="flex items-center gap-2">
                <Bookmark size={14} style={{ color: isPromptSaved(p.id) ? '#5236ab' : 'var(--app-text-hint)' }} fill={isPromptSaved(p.id) ? '#5236ab' : 'none'} />
              </div>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{p.title}</h4>
            <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.tags.slice(0, 3).map(tag => <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-muted)' }}>{tag}</span>)}
            </div>
            <div className="flex items-center justify-between text-sm" style={{ color: 'var(--app-text-muted)' }}>
              <span>★ {p.rating} · {p.uses.toLocaleString()} uses</span>
              <span>by {p.author}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {contributePromptOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6 w-full max-w-lg" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Contribute a prompt</h3>
            <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 16 }}>Submit your prompt for community review. It will be pending approval.</p>
            <div className="space-y-3 mb-4">
              <input type="text" placeholder="Title" className="w-full px-4 py-2 rounded-lg outline-none text-sm" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
              <input type="text" placeholder="Description" className="w-full px-4 py-2 rounded-lg outline-none text-sm" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
              <textarea placeholder="Template text" rows={4} className="w-full px-4 py-2 rounded-lg outline-none text-sm resize-y" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
              <input type="text" placeholder="Tags (comma-separated)" className="w-full px-4 py-2 rounded-lg outline-none text-sm" style={{ backgroundColor: 'var(--app-tab-bg)', border: '1px solid var(--app-border)', color: 'var(--app-text-primary)' }} />
            </div>
            <div className="flex gap-3">
              <motion.button
                {...secondaryButtonMotion()}
                onClick={() => setContributePromptOpen(false)}
                className="px-4 py-2 rounded-lg font-semibold cursor-pointer border"
                style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}
              >
                Cancel
              </motion.button>
              <motion.button
                {...primaryButtonMotion()}
                onClick={() => setContributePromptOpen(false)}
                className="px-4 py-2 rounded-lg font-semibold cursor-pointer"
                style={{ backgroundColor: '#5236ab', color: 'white' }}
              >
                Submit — Thanks, pending approval
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
