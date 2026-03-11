/**
 * Prompt Library — standalone page: search, filters, prompt grid, contribute modal.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Bookmark } from 'lucide-react';
import { promptLibrary, isPromptSaved } from '../../data/learnData';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
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
    <div className="font-primary">
      <h1 className="page-title">Prompt Library</h1>
      <p className="page-subtitle">
        Search and browse prompts by category. Copy, customize, bookmark, or apply in a challenge.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-hint" />
          <input type="text" placeholder="Search prompts by title, tag, or description..." value={promptSearch} onChange={(e) => setPromptSearch(e.target.value)} className="input-search" />
        </div>
        <motion.button
          {...primaryButtonMotion()}
          onClick={() => setContributePromptOpen(true)}
          className="btn-primary-purple shrink-0"
        >
          + Contribute Prompt
        </motion.button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm-medium text-app-muted">Category</label>
        <select value={promptCategory} onChange={(e) => setPromptCategory(e.target.value)} className="select-dropdown select-dropdown-wide">
          <option value="all">All categories</option>
          <option value="communication">Communication</option>
          <option value="data">Data</option>
          <option value="productivity">Productivity</option>
          <option value="development">Development</option>
          <option value="project management">Project Management</option>
          <option value="strategy">Strategy</option>
        </select>
        <label className="text-sm-medium text-app-muted">Show</label>
        <select value={promptSavedOnly ? 'saved' : 'all'} onChange={(e) => setPromptSavedOnly(e.target.value === 'saved')} className="select-dropdown">
          <option value="all">All prompts</option>
          <option value="saved">My Saved ({savedPrompts})</option>
        </select>
      </div>
      <div className="text-right text-sm-regular text-app-muted mb-4">{filteredPrompts.length} prompts</div>
      <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((p, i) => (
          <motion.div
            {...cardHoverMotion()}
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(`/app/learn/prompts/${p.id}`)}
            className="card-prompt"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="badge-tab-bg text-xs-semibold px-2 py-0.5 rounded">{p.category}</span>
              <div className="flex items-center gap-2">
                <Bookmark size={14} className={clsx(isPromptSaved(p.id) ? 'text-[#5236ab]' : 'text-app-hint')} fill={isPromptSaved(p.id) ? '#5236ab' : 'none'} />
              </div>
            </div>
            <h4 className="text-base-semibold text-app-primary mb-2">{p.title}</h4>
            <p className="text-sm-regular text-app-secondary mb-3" style={{ lineHeight: '20px' }}>{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.tags.slice(0, 3).map(tag => <span key={tag} className="badge-tab-muted px-2 py-0.5 rounded text-xs">{tag}</span>)}
            </div>
            <div className="flex items-center justify-between text-sm-regular text-app-muted">
              <span>★ {p.rating} · {p.uses.toLocaleString()} uses</span>
              <span>by {p.author}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {contributePromptOpen && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <h3 className="text-lg-semibold text-app-primary mb-3">Contribute a prompt</h3>
            <p className="text-sm-regular text-app-secondary mb-4">Submit your prompt for community review. It will be pending approval.</p>
            <div className="space-y-3 mb-4">
              <input type="text" placeholder="Title" className="input-modal" />
              <input type="text" placeholder="Description" className="input-modal" />
              <textarea placeholder="Template text" rows={4} className="textarea-modal" />
              <input type="text" placeholder="Tags (comma-separated)" className="input-modal" />
            </div>
            <div className="flex gap-3">
              <motion.button
                {...secondaryButtonMotion()}
                onClick={() => setContributePromptOpen(false)}
                className="btn-secondary-border"
              >
                Cancel
              </motion.button>
              <motion.button
                {...primaryButtonMotion()}
                onClick={() => setContributePromptOpen(false)}
                className="btn-primary-purple"
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
