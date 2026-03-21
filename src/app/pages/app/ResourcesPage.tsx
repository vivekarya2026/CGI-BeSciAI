/**
 * Resources — standalone page: search, type filter, resource grid.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Video, Copy, Target, Headphones, Clock, Bookmark } from 'lucide-react';
import { resources as resourcesList, isResourceSaved, type ResourceType } from '../../data/learnData';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useUser } from '../../context/UserContext';
import { cardHoverMotion, staggerContainer } from '../../components/ui/motionPresets';
import { PageHeader } from '../../components/PageHeader';
import { DashboardMiniMessages } from '../../components/DashboardMiniMessages';

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
  const { progress } = useUser();
  const [miniMessagesOpen, setMiniMessagesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<'all' | ResourceType>('all');

  const filteredResources = resourcesList.filter(r => {
    const typeMatch = resourceFilter === 'all' || r.type === resourceFilter;
    const searchMatch = !searchQuery.trim() || (r.title + r.desc).toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div className="font-primary">
      <PageHeader
        title="Resources"
        subtitle="Guides, videos, templates, tools, podcasts, and articles. Search and filter by type."
        progress={{ xp: progress.xp ?? 0, modulesCompleted: progress.modulesCompleted ?? 0, totalModules: progress.totalModules ?? 12, streak: progress.streak ?? 0 }}
        onMessagesClick={() => setMiniMessagesOpen(prev => !prev)}
        onNavigate={navigate}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 w-full">
        <div className="relative search-filter-width">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base input-with-icon w-full pl-9 text-app-primary placeholder:text-app-muted"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm-medium text-app-muted whitespace-nowrap">Type</label>
          <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value as 'all' | ResourceType)} className="select-dropdown min-w-[150px]">
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
      <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((r, i) => {
          const iconBadgeClass = r.type === 'guide' ? 'icon-badge-guide' : r.type === 'video' ? 'icon-badge-video' : r.type === 'template' ? 'icon-badge-template' : r.type === 'tool' ? 'icon-badge-tool' : r.type === 'podcast' ? 'icon-badge-podcast' : 'icon-badge-article';
          return (
            <motion.div
              {...cardHoverMotion()}
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/app/learn/resources/${r.id}`)}
              className="card-resource"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBadgeClass}`}>{typeIcons[r.type] || <FileText size={18} />}</div>
                  <span className="capitalize text-xs-semibold text-app-muted">{r.type}</span>
                </div>
                <Bookmark size={16} className={clsx(isResourceSaved(r.id) ? 'text-cgi-purple' : 'text-app-hint')} fill={isResourceSaved(r.id) ? 'var(--cgi-purple)' : 'none'} />
              </div>
              <h4 className="text-base-semibold text-app-primary mb-2">{r.title}</h4>
              <p className="text-sm-regular text-app-secondary mb-3 leading-5">{r.desc}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-app-hint"><Clock size={12} /> {r.duration}{r.date ? ` · ${r.date}` : ''}</span>
                <span className="text-sm-semibold link-brand">{r.type === 'video' ? 'Watch' : r.type === 'template' ? 'Copy' : 'Read'} →</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <DashboardMiniMessages
        isOpen={miniMessagesOpen}
        onClose={() => setMiniMessagesOpen(false)}
        onOpenFullMessages={() => navigate('/app/messages')}
      />
    </div>
  );
}
