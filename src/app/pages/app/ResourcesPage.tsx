/**
 * Resources — standalone page: search, type filter, resource grid.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Video, Copy, Target, Headphones, Clock, Bookmark } from 'lucide-react';
import { resources as resourcesList, isResourceSaved, type ResourceType } from '../../data/learnData';
import { useNavigate } from 'react-router';

const typeIcons: Record<string, React.ReactNode> = {
  guide: <FileText size={18} />,
  video: <Video size={18} />,
  template: <Copy size={18} />,
  tool: <Target size={18} />,
  podcast: <Headphones size={18} />,
  article: <FileText size={18} />,
};

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<'all' | ResourceType>('all');

  const filteredResources = resourcesList.filter(r => {
    const typeMatch = resourceFilter === 'all' || r.type === resourceFilter;
    const searchMatch = !searchQuery.trim() || (r.title + r.desc).toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>Resources</h1>
      <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px', marginBottom: 24 }}>
        Guides, videos, templates, tools, podcasts, and articles. Search and filter by type.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
          <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg outline-none" style={{ fontSize: 16, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)', whiteSpace: 'nowrap' }}>Type</label>
          <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value as 'all' | ResourceType)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 150, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
            <option value="all">All types</option>
            <option value="guide">Guides</option>
            <option value="video">Videos</option>
            <option value="template">Templates</option>
            <option value="tool">Tools</option>
            <option value="podcast">Podcasts</option>
            <option value="article">Articles</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }} onClick={() => navigate(`/app/learn/resources/${r.id}`)} className="rounded-xl p-5 cursor-pointer" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: r.type === 'guide' ? '#f2f1f9' : r.type === 'video' ? '#fce8eb' : r.type === 'template' ? '#ccfbf1' : r.type === 'tool' ? '#fef6e9' : r.type === 'podcast' ? '#ede9fe' : '#e0f2fe', color: r.type === 'guide' ? '#5236ab' : r.type === 'video' ? '#e31937' : r.type === 'template' ? '#14b8a6' : r.type === 'tool' ? '#f59e0b' : r.type === 'podcast' ? '#8b5cf6' : '#0ea5e9' }}>{typeIcons[r.type] || <FileText size={18} />}</div>
                <span className="capitalize text-xs font-semibold" style={{ color: 'var(--app-text-muted)' }}>{r.type}</span>
              </div>
              <Bookmark size={16} style={{ color: isResourceSaved(r.id) ? '#5236ab' : 'var(--app-text-hint)' }} fill={isResourceSaved(r.id) ? '#5236ab' : 'none'} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{r.title}</h4>
            <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-3">{r.desc}</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--app-text-hint)' }}><Clock size={12} /> {r.duration}{r.date ? ` · ${r.date}` : ''}</span>
              <span className="text-sm font-semibold" style={{ color: '#5236ab' }}>{r.type === 'video' ? 'Watch' : r.type === 'template' ? 'Copy' : 'Read'} →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
