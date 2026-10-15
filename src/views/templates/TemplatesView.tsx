import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, Sparkles, Loader2, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBoard } from '../../context/BoardContext';
import { INITIAL_TEMPLATES } from '../../data/initialData';

export const TemplatesView: React.FC = () => {
  const { useTemplate } = useBoard();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const categories = ['All', 'Engineering', 'Product', 'Personal'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? INITIAL_TEMPLATES
      : INITIAL_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (templateId: string) => {
    setLoadingTemplateId(templateId);
    try {
      await useTemplate(templateId);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTemplateId(null);
    }
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-3.5rem)] md:h-screen p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Curated Workflows</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-1000">
            Board Templates
          </h1>
          <p className="text-xs text-light-800 dark:text-dark-800 mt-1">
            Jumpstart your projects with battle-tested workflows, custom column structures, and starter tasks.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 border-b border-light-300 dark:border-dark-400 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-dark-1000 dark:text-dark-50 font-semibold'
                  : 'text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000 hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/60 p-6 shadow-xs backdrop-blur-md hover:border-indigo-500/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {tmpl.category}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-light-800 dark:text-dark-800">
                    <span>{tmpl.lists.length} columns</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3 text-indigo-500" />
                      {tmpl.sampleCards.length} starter tasks
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-dark-1000">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-light-800 dark:text-dark-800 mt-1.5 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Workflow Preview Pills */}
                <div className="mt-4 pt-3 border-t border-light-200 dark:border-dark-400/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-light-800 dark:text-dark-800 mb-2">
                    Included Columns
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.lists.map((l, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 rounded bg-light-200 dark:bg-dark-300 px-2 py-0.5 text-[11px] font-medium text-neutral-800 dark:text-dark-950"
                      >
                        <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                        <span>{l}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-3 border-t border-light-200 dark:border-dark-400/60 flex items-center justify-end">
                <button
                  onClick={() => handleUseTemplate(tmpl.id)}
                  disabled={loadingTemplateId === tmpl.id}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors shadow-2xs"
                >
                  {loadingTemplateId === tmpl.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating board...</span>
                    </>
                  ) : (
                    <>
                      <span>Use this template</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;
