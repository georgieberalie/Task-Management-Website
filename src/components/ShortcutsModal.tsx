import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useBoard } from '../context/BoardContext';

export const ShortcutsModal: React.FC = () => {
  const { activeModal, closeModal } = useBoard();

  if (activeModal !== 'shortcuts') return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['G', 'B'], description: 'Go to Boards' },
        { keys: ['G', 'T'], description: 'Go to Templates' },
        { keys: ['G', 'M'], description: 'Go to Members' },
        { keys: ['G', 'S'], description: 'Go to Settings' },
      ],
    },
    {
      category: 'Search & Global',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open Command Palette' },
        { keys: ['?'], description: 'Open Keyboard Shortcuts' },
        { keys: ['Esc'], description: 'Close modal or cancel editing' },
      ],
    },
    {
      category: 'Boards & Tasks',
      items: [
        { keys: ['Enter'], description: 'Save new card / rename column' },
        { keys: ['Drag'], description: 'Move cards within or across lists' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-light-300 dark:border-dark-400">
          <div className="flex items-center gap-2.5">
            <Keyboard className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-dark-1000">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="rounded p-1 text-light-800 hover:text-neutral-900 dark:hover:text-dark-1000"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-light-800 dark:text-dark-800 mb-2.5">
                {group.category}
              </p>
              <div className="space-y-2">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 text-xs"
                  >
                    <span className="text-neutral-800 dark:text-dark-950 font-medium">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-light-400 dark:border-dark-400 bg-light-200 dark:bg-dark-300 px-1.5 font-mono text-[11px] font-semibold text-neutral-900 dark:text-dark-1000 shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
