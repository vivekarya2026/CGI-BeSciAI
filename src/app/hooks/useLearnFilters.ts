/**
 * useLearnFilters — encapsulates all filter state and derived values for LearnPage.
 * Extracted to reduce LearnPage from 10 useState calls to a single hook import.
 */

import { useMemo, useState } from 'react';
import { trainings, microLearnings, getCompletedMicroIds } from '../data/learnData';

export function useLearnFilters() {
  // ─── Training filters ─────────────────────────────────────────────────────
  const [trainingSearchQuery, setTrainingSearchQuery] = useState('');
  const [trainingSubjectFilter, setTrainingSubjectFilter] = useState('all');
  const [trainingFormatFilter, setTrainingFormatFilter] = useState('all');
  const [trainingLevelFilter, setTrainingLevelFilter] = useState('all');

  // ─── Micro-learning filters ───────────────────────────────────────────────
  const [microSearchQuery, setMicroSearchQuery] = useState('');
  const [microTopicFilter, setMicroTopicFilter] = useState('all');
  const [microToolFilter, setMicroToolFilter] = useState('all');
  const [microSortFilter, setMicroSortFilter] = useState('default');

  // ─── Resume cards ─────────────────────────────────────────────────────────
  const unfinishedTraining = useMemo(
    () => trainings.find(t => t.progress && t.progress > 0 && t.progress < 100),
    []
  );

  const recommendedLesson = useMemo(() => {
    const completedMicroIds = getCompletedMicroIds();
    const unfinished = microLearnings.find(m => {
      const isCompleted = m.completed || completedMicroIds.has(m.id);
      return !isCompleted && m.progress && m.progress > 0;
    });
    return unfinished ?? microLearnings.find(m => {
      const isCompleted = m.completed || completedMicroIds.has(m.id);
      return !isCompleted;
    });
  }, []);

  // ─── Filtered results ─────────────────────────────────────────────────────
  const filteredTrainings = useMemo(() => {
    return trainings.filter(t => {
      const subjectOk = trainingSubjectFilter === 'all' || t.category === trainingSubjectFilter;
      const formatOk = trainingFormatFilter === 'all' || t.format === trainingFormatFilter;
      const levelOk = trainingLevelFilter === 'all' || t.difficulty === trainingLevelFilter;
      const q = trainingSearchQuery.trim().toLowerCase();
      const searchOk = !q || [t.title, t.description, t.category].some(
        v => v && String(v).toLowerCase().includes(q)
      );
      return subjectOk && formatOk && levelOk && searchOk;
    });
  }, [trainingSearchQuery, trainingSubjectFilter, trainingFormatFilter, trainingLevelFilter]);

  const filteredMicro = useMemo(() => {
    return microLearnings
      .filter(m => {
        const topicOk = microTopicFilter === 'all' || m.topic === microTopicFilter;
        const toolOk = microToolFilter === 'all' || m.tool === microToolFilter;
        const q = microSearchQuery.trim().toLowerCase();
        const searchOk = !q || [m.title, m.description, m.topic, m.tool].some(
          v => v && String(v).toLowerCase().includes(q)
        );
        return topicOk && toolOk && searchOk;
      })
      .sort((a, b) => {
        if (microSortFilter === 'recent') return (b.addedAt || '').localeCompare(a.addedAt || '');
        if (microSortFilter === 'popular') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
        return 0;
      })
      .slice(0, 6);
  }, [microSearchQuery, microTopicFilter, microToolFilter, microSortFilter]);

  // ─── Filter option lists ───────────────────────────────────────────────────
  const subjects = useMemo(() => ['all', ...new Set(trainings.map(t => t.category))], []);
  const formats = useMemo(() => ['all', ...new Set(trainings.map(t => t.format).filter(Boolean))], []);
  const levels = useMemo(() => ['all', ...new Set(trainings.map(t => t.difficulty).filter(Boolean))], []);
  const topics = useMemo(() => ['all', ...new Set(microLearnings.map(m => m.topic))], []);
  const tools = useMemo(() => ['all', ...new Set(microLearnings.map(m => m.tool))], []);

  return {
    // State
    trainingSearchQuery, setTrainingSearchQuery,
    trainingSubjectFilter, setTrainingSubjectFilter,
    trainingFormatFilter, setTrainingFormatFilter,
    trainingLevelFilter, setTrainingLevelFilter,
    microSearchQuery, setMicroSearchQuery,
    microTopicFilter, setMicroTopicFilter,
    microToolFilter, setMicroToolFilter,
    microSortFilter, setMicroSortFilter,
    // Computed
    unfinishedTraining,
    recommendedLesson,
    filteredTrainings,
    filteredMicro,
    subjects,
    formats,
    levels,
    topics,
    tools,
  };
}
