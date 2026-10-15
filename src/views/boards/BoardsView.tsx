import React, { useState } from 'react';
import { Star, Plus, Eye, Globe, Lock, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useBoard } from '../../context/BoardContext';

export const BoardsView: React.FC = () => {
  const { boards, cards, activeBoardId, setActiveBoardId, createBoard, toggleStarBoard } = useBoard();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVisibility, setNewVisibility] = useState<'public' | 'workspace' | 'private'>('public');

  const starredBoards = boards.filter((b) => b.isStarred);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createBoard(newTitle.trim(), newVisibility);
      setNewTitle('');
      setIsCreating(false);
    }
  };

  const getVisibilityIcon = (v: string) => {
    switch (v) {
      case 'public':
        return <Eye className="h-3 w-3" />;
      case 'workspace':
        return <Globe className="h-3 w-3" />;
      default:
        return <Lock className="h-3 w-3" />;
    }
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-3.5rem)] md:h-screen p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-1000">
              Boards
            </h1>
            <p className="text-xs text-light-800 dark:text-dark-800 mt-1">
              Organize projects, milestones, and workflows across your team.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Board</span>
          </button>
        </div>

        {/* Starred Boards */}
        {starredBoards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-dark-950">
                Starred Boards
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {starredBoards.map((board) => {
                const cardCount = cards.filter((c) => c.boardId === board.id).length;
                return (
                  <div
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className="group relative flex flex-col justify-between rounded-xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/60 p-4 shadow-2xs hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="flex items-center gap-1.5 rounded-md bg-light-200 dark:bg-dark-300 px-2 py-0.5 text-[10px] font-medium text-light-800 dark:text-dark-800 capitalize">
                          {getVisibilityIcon(board.visibility)}
                          <span>{board.visibility}</span>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarBoard(board.id);
                          }}
                          className="p-1 text-light-800 hover:text-amber-400"
                        >
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        </button>
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000 mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {board.title}
                      </h3>
                      {board.description && (
                        <p className="text-xs text-light-800 dark:text-dark-800 mt-1 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-light-800 dark:text-dark-800 pt-2 border-t border-light-200 dark:border-dark-400/60">
                      <span>{cardCount} cards • {board.lists.length} lists</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Workspace Boards */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LayoutDashboard className="h-4 w-4 text-indigo-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-dark-950">
              Workspace Boards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => {
              const cardCount = cards.filter((c) => c.boardId === board.id).length;
              const isCurrent = activeBoardId === board.id;

              return (
                <div
                  key={board.id}
                  onClick={() => setActiveBoardId(board.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 shadow-2xs hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all backdrop-blur-sm ${
                    isCurrent
                      ? 'border-indigo-500/60 bg-light-50 dark:bg-dark-200'
                      : 'border-light-300 dark:border-dark-400 bg-light-50/80 dark:bg-dark-200/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="flex items-center gap-1.5 rounded-md bg-light-200 dark:bg-dark-300 px-2 py-0.5 text-[10px] font-medium text-light-800 dark:text-dark-800 capitalize">
                        {getVisibilityIcon(board.visibility)}
                        <span>{board.visibility}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarBoard(board.id);
                        }}
                        className="p-1 text-light-800 dark:text-dark-800 hover:text-amber-400"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            board.isStarred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000 mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className="text-xs text-light-800 dark:text-dark-800 mt-1 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-light-800 dark:text-dark-800 pt-2 border-t border-light-200 dark:border-dark-400/60">
                    <span>{cardCount} cards • {board.lists.length} lists</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}

            {/* Quick Create Board Tile */}
            <div
              onClick={() => setIsCreating(true)}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-light-300 dark:border-dark-400 bg-light-100/50 dark:bg-dark-200/30 p-6 text-center hover:border-indigo-500 hover:bg-light-100 dark:hover:bg-dark-200/60 transition-all cursor-pointer min-h-[140px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-light-200 dark:bg-dark-300 text-indigo-600 dark:text-indigo-400 mb-2">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-dark-950">
                Create new board
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Board Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-dark-1000 mb-1">
              Create New Board
            </h3>
            <p className="text-xs text-light-800 dark:text-dark-800 mb-4">
              A board is where tasks live. Set a title and initial visibility.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
                  Board Title
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Design System Sprint, Q4 OKRs..."
                  className="w-full rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-2 text-xs text-neutral-900 dark:text-dark-1000 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
                  Visibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['public', 'workspace', 'private'] as const).map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setNewVisibility(v)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs capitalize transition-all ${
                        newVisibility === v
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 text-light-900 dark:text-dark-950 hover:bg-light-200'
                      }`}
                    >
                      {getVisibilityIcon(v)}
                      <span className="mt-1">{v}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardsView;
