import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, Layers, Users, Settings, Plus, X } from 'lucide-react';
import { useBoard, ActivePage } from '../context/BoardContext';

export const CommandPalette: React.FC = () => {
  const {
    activeModal,
    closeModal,
    boards,
    cards,
    setActiveBoardId,
    setActivePage,
    openCardModal,
    createBoard,
  } = useBoard();

  const [query, setQuery] = useState('');

  const isOpen = activeModal === 'command-palette';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeModal();
        } else {
          // Open
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCards = cards.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    closeModal();
  };

  const selectBoard = (boardId: string) => {
    setActiveBoardId(boardId);
    closeModal();
  };

  const selectCard = (cardId: string) => {
    openCardModal(cardId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-light-300 dark:border-dark-400 px-4 py-3 bg-light-100/50 dark:bg-dark-200/50">
          <Search className="h-4 w-4 text-light-800 dark:text-dark-800 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search boards, tasks, or jump to page..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none"
          />
          <button
            onClick={closeModal}
            className="rounded p-1 text-light-800 hover:text-neutral-900 dark:hover:text-dark-1000"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {/* Quick Navigation Pages */}
          <div>
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-light-800 dark:text-dark-800">
              Navigation
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => navigateTo('boards')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                <span>Go to Boards</span>
                <kbd className="ml-auto font-mono text-[10px] text-light-800 dark:text-dark-800">G B</kbd>
              </button>
              <button
                onClick={() => navigateTo('templates')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
              >
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>Go to Templates</span>
                <kbd className="ml-auto font-mono text-[10px] text-light-800 dark:text-dark-800">G T</kbd>
              </button>
              <button
                onClick={() => navigateTo('members')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
              >
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Go to Members</span>
                <kbd className="ml-auto font-mono text-[10px] text-light-800 dark:text-dark-800">G M</kbd>
              </button>
              <button
                onClick={() => navigateTo('settings')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
              >
                <Settings className="h-4 w-4 text-indigo-500" />
                <span>Go to Settings</span>
                <kbd className="ml-auto font-mono text-[10px] text-light-800 dark:text-dark-800">G S</kbd>
              </button>
            </div>
          </div>

          {/* Boards Matches */}
          {filteredBoards.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-light-800 dark:text-dark-800">
                Boards
              </p>
              <div className="space-y-0.5">
                {filteredBoards.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => selectBoard(b.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
                  >
                    <span className="font-semibold">{b.title}</span>
                    <span className="text-[10px] text-light-800 dark:text-dark-800 capitalize">({b.visibility})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards Matches */}
          {filteredCards.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-light-800 dark:text-dark-800">
                Tasks / Cards
              </p>
              <div className="space-y-0.5">
                {filteredCards.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCard(c.id)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-[10px] text-light-800 dark:text-dark-800 shrink-0 ml-2">Open card</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
