import React, { useState, useRef, useEffect } from 'react';
import {
  Star,
  Eye,
  Lock,
  Globe,
  Plus,
  MoreHorizontal,
  Kanban,
  Calendar,
  Table,
  Search,
  Filter,
  X,
  Menu,
  Share2,
  Trash2,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { useBoard, BoardViewMode } from '../context/BoardContext';
import { Visibility } from '../types';

interface BoardHeaderProps {
  onOpenMobileMenu: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activeBoard,
    updateBoard,
    toggleStarBoard,
    deleteBoard,
    createList,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedLabelFilter,
    setSelectedLabelFilter,
    selectedMemberFilter,
    setSelectedMemberFilter,
    labels,
    members,
    openModal,
  } = useBoard();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [newListModalOpen, setNewListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeBoard) {
      setTitleInput(activeBoard.title);
    }
  }, [activeBoard]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  if (!activeBoard) return null;

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== activeBoard.title) {
      updateBoard(activeBoard.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleVisibilityChange = (visibility: Visibility) => {
    updateBoard(activeBoard.id, { visibility });
    setVisibilityMenuOpen(false);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(activeBoard.id, newListName.trim());
      setNewListName('');
      setNewListModalOpen(false);
    }
  };

  const getVisibilityIcon = (v: Visibility) => {
    switch (v) {
      case 'public':
        return <Eye className="h-3.5 w-3.5" />;
      case 'workspace':
        return <Globe className="h-3.5 w-3.5" />;
      case 'private':
        return <Lock className="h-3.5 w-3.5" />;
    }
  };

  const hasActiveFilters = Boolean(searchQuery || selectedLabelFilter || selectedMemberFilter);

  return (
    <header className="relative z-20 flex flex-col border-b border-light-300 dark:border-dark-400 bg-light-50/80 dark:bg-dark-100/90 backdrop-blur-md px-4 py-2.5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Board Title + Star + Visibility */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobileMenu}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Editable Board Title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(activeBoard.title);
                  setIsEditingTitle(false);
                }
              }}
              className="rounded-md border border-indigo-500 bg-light-50 dark:bg-dark-200 px-2.5 py-1 text-base font-bold text-neutral-900 dark:text-dark-1000 outline-none ring-2 ring-indigo-500/20"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-base font-bold text-neutral-900 dark:text-dark-1000 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
            >
              <span>{activeBoard.title}</span>
            </button>
          )}

          {/* Star Favorite Toggle */}
          <button
            onClick={() => toggleStarBoard(activeBoard.id)}
            title={activeBoard.isStarred ? 'Unstar board' : 'Star board'}
            className="flex h-7 w-7 items-center justify-center rounded-md text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
          >
            <Star
              className={`h-4 w-4 transition-transform ${
                activeBoard.isStarred ? 'fill-amber-400 text-amber-400 scale-110' : ''
              }`}
            />
          </button>

          {/* Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setVisibilityMenuOpen(!visibilityMenuOpen)}
              className="flex items-center gap-1.5 rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
            >
              {getVisibilityIcon(activeBoard.visibility)}
              <span className="capitalize">{activeBoard.visibility}</span>
            </button>

            {visibilityMenuOpen && (
              <div className="absolute left-0 top-9 z-50 w-44 rounded-lg border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-200 p-1 shadow-lg">
                <button
                  onClick={() => handleVisibilityChange('public')}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Public</span>
                  {activeBoard.visibility === 'public' && <Check className="ml-auto h-3.5 w-3.5 text-indigo-500" />}
                </button>
                <button
                  onClick={() => handleVisibilityChange('workspace')}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Workspace</span>
                  {activeBoard.visibility === 'workspace' && <Check className="ml-auto h-3.5 w-3.5 text-indigo-500" />}
                </button>
                <button
                  onClick={() => handleVisibilityChange('private')}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Private</span>
                  {activeBoard.visibility === 'private' && <Check className="ml-auto h-3.5 w-3.5 text-indigo-500" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: View Switcher, Filter & Search, + New list, Menu */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('board')}
              title="Kanban Board view"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-light-50 dark:bg-dark-300 text-neutral-900 dark:text-dark-1000 shadow-xs'
                  : 'text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              title="Calendar view"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-light-50 dark:bg-dark-300 text-neutral-900 dark:text-dark-1000 shadow-xs'
                  : 'text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table view"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-light-50 dark:bg-dark-300 text-neutral-900 dark:text-dark-1000 shadow-xs'
                  : 'text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-2 py-1 shadow-2xs">
              <Search className="h-3.5 w-3.5 text-light-800 dark:text-dark-800" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter cards..."
                className="w-24 sm:w-36 bg-transparent px-1.5 text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Popover Button */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              title="Filter by Label or Assignee"
              className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors shadow-2xs ${
                hasActiveFilters
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 text-light-900 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white font-bold">
                  {(searchQuery ? 1 : 0) + (selectedLabelFilter ? 1 : 0) + (selectedMemberFilter ? 1 : 0)}
                </span>
              )}
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 top-9 z-50 w-64 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-200 p-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-light-300 dark:border-dark-400">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-dark-1000">Filter Cards</span>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedLabelFilter(null);
                        setSelectedMemberFilter(null);
                      }}
                      className="text-[11px] text-indigo-500 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Filter by Label */}
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-light-800 dark:text-dark-800 mb-1.5 uppercase tracking-wide">
                    By Label
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {labels.map((l) => (
                      <button
                        key={l.id}
                        onClick={() =>
                          setSelectedLabelFilter(selectedLabelFilter === l.id ? null : l.id)
                        }
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                          selectedLabelFilter === l.id
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                            : 'border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 text-neutral-700 dark:text-dark-950 hover:bg-light-200'
                        }`}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: l.colorCode }}
                        />
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Member */}
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-light-800 dark:text-dark-800 mb-1.5 uppercase tracking-wide">
                    By Member
                  </p>
                  <div className="space-y-1">
                    {members.map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setSelectedMemberFilter(selectedMemberFilter === m.id ? null : m.id)
                        }
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                          selectedMemberFilter === m.id
                            ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-neutral-700 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300'
                        }`}
                      >
                        <img src={m.avatar} alt={m.name} className="h-5 w-5 rounded-full object-cover" />
                        <span>{m.name}</span>
                        {selectedMemberFilter === m.id && <Check className="ml-auto h-3 w-3 text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New List Button */}
          <button
            onClick={() => setNewListModalOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-dark-1000 dark:text-dark-50 dark:hover:bg-white/90 transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New list</span>
          </button>

          {/* Board Options Menu */}
          <div className="relative">
            <button
              onClick={() => setBoardMenuOpen(!boardMenuOpen)}
              title="Board options"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {boardMenuOpen && (
              <div className="absolute right-0 top-9 z-50 w-48 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-200 p-1 shadow-xl">
                <button
                  onClick={() => {
                    setIsEditingTitle(true);
                    setBoardMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Rename board</span>
                </button>
                <button
                  onClick={() => {
                    openModal('export-board');
                    setBoardMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => {
                    openModal('share-board');
                    setBoardMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share link</span>
                </button>
                <div className="my-1 border-b border-light-300 dark:border-dark-400" />
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete board "${activeBoard.title}"?`)) {
                      deleteBoard(activeBoard.id);
                    }
                    setBoardMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete board</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New List Modal inline popover */}
      {newListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-200 p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000 mb-2">Create New List</h3>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name (e.g. In Review, QA, Deployed)..."
                className="w-full rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-3 py-2 text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewListModalOpen(false)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Create list
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default BoardHeader;
