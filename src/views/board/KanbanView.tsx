import React, { useState, useRef } from 'react';
import {
  Plus,
  MoreHorizontal,
  Clock,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Trash2,
  X,
  GripVertical,
} from 'lucide-react';
import { useBoard } from '../../context/BoardContext';
import { Card, List } from '../../types';

export const KanbanView: React.FC = () => {
  const {
    activeBoard,
    cards,
    labels,
    members,
    createCard,
    createList,
    updateList,
    deleteList,
    moveCard,
    openCardModal,
    searchQuery,
    selectedLabelFilter,
    selectedMemberFilter,
  } = useBoard();

  const [activeAddCardListId, setActiveAddCardListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');
  const [columnMenuId, setColumnMenuId] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!activeBoard) return null;

  // Filter cards based on search and filters
  const filteredCards = cards.filter((card) => {
    if (card.boardId !== activeBoard.id) return false;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = card.title.toLowerCase().includes(q);
      const matchesDesc = card.description.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc) return false;
    }

    // Label filter
    if (selectedLabelFilter && !card.labels.includes(selectedLabelFilter)) {
      return false;
    }

    // Member filter
    if (selectedMemberFilter && !card.members.includes(selectedMemberFilter)) {
      return false;
    }

    return true;
  });

  const handleAddCardSubmit = (listId: string) => {
    if (newCardTitle.trim()) {
      createCard(activeBoard.id, listId, newCardTitle.trim());
      setNewCardTitle('');
    }
  };

  const handleListRenameSubmit = (listId: string) => {
    if (editingListName.trim()) {
      updateList(activeBoard.id, listId, editingListName.trim());
    }
    setEditingListId(null);
  };

  const handleAddColumnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnName.trim()) {
      createList(activeBoard.id, newColumnName.trim());
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCardId(cardId);
  };

  const handleDragOver = (e: React.DragEvent, listId: string, cardId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverListId(listId);
    if (cardId) setDragOverCardId(cardId);
  };

  const handleDragLeave = () => {
    // optional reset
  };

  const handleDrop = (e: React.DragEvent, targetListId: string, targetCardId?: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (!cardId) return;

    if (targetCardId && targetCardId !== cardId) {
      const listCards = filteredCards
        .filter((c) => c.listId === targetListId)
        .sort((a, b) => a.position - b.position);
      const targetIndex = listCards.findIndex((c) => c.id === targetCardId);
      moveCard(cardId, targetListId, targetIndex >= 0 ? targetIndex : undefined);
    } else {
      moveCard(cardId, targetListId);
    }

    setDraggedCardId(null);
    setDragOverListId(null);
    setDragOverCardId(null);
  };

  const formatDueDate = (dueDateStr: string | null) => {
    if (!dueDateStr) return null;
    const date = new Date(dueDateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const isOverdue = diffDays < 0;
    const isDueSoon = diffDays >= 0 && diffDays <= 2;

    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let badgeClass = 'bg-light-200 text-light-900 dark:bg-dark-300 dark:text-dark-950';
    if (isOverdue) {
      badgeClass = 'bg-red-500/15 text-red-600 dark:text-red-400 font-semibold';
    } else if (isDueSoon) {
      badgeClass = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold';
    }

    return {
      text: formatted,
      isOverdue,
      badgeClass,
    };
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative z-10 flex flex-1 h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5.5rem)] overflow-x-auto overflow-y-hidden p-6 px-6 sm:px-8 select-none"
    >
      <div className="flex items-start gap-5">
        {/* Render each column/list */}
        {activeBoard.lists.map((list) => {
          const listCards = filteredCards
            .filter((c) => c.listId === list.id)
            .sort((a, b) => a.position - b.position);

          const isOverThisList = dragOverListId === list.id;

          return (
            <div
              key={list.id}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
              className={`flex flex-col w-[18rem] shrink-0 max-h-full rounded-xl border transition-all duration-150 ${
                isOverThisList
                  ? 'border-indigo-500/50 bg-light-50/90 dark:bg-dark-200/95 ring-2 ring-indigo-500/20'
                  : 'border-light-300/80 dark:border-dark-400/80 bg-light-100/95 dark:bg-dark-200/60 shadow-xs'
              } backdrop-blur-md`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 pb-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  {editingListId === list.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editingListName}
                      onChange={(e) => setEditingListName(e.target.value)}
                      onBlur={() => handleListRenameSubmit(list.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleListRenameSubmit(list.id);
                        if (e.key === 'Escape') setEditingListId(null);
                      }}
                      className="rounded border border-indigo-500 bg-light-50 dark:bg-dark-300 px-2 py-0.5 text-xs font-bold text-neutral-900 dark:text-dark-1000 outline-none"
                    />
                  ) : (
                    <h3
                      onClick={() => {
                        setEditingListId(list.id);
                        setEditingListName(list.name);
                      }}
                      title="Click to rename"
                      className="cursor-pointer truncate text-xs font-bold tracking-tight text-neutral-900 dark:text-dark-1000 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {list.name}
                    </h3>
                  )}
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-light-200 dark:bg-dark-300 px-1.5 text-[10px] font-semibold text-light-800 dark:text-dark-800">
                    {listCards.length}
                  </span>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveAddCardListId(activeAddCardListId === list.id ? null : list.id)}
                    title="Add card"
                    className="flex h-6 w-6 items-center justify-center rounded text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setColumnMenuId(columnMenuId === list.id ? null : list.id)}
                      title="List options"
                      className="flex h-6 w-6 items-center justify-center rounded text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>

                    {columnMenuId === list.id && (
                      <div className="absolute right-0 top-7 z-30 w-40 rounded-lg border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-1 shadow-lg">
                        <button
                          onClick={() => {
                            setEditingListId(list.id);
                            setEditingListName(list.name);
                            setColumnMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2.5 py-1 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            setActiveAddCardListId(list.id);
                            setColumnMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2.5 py-1 text-xs text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-200"
                        >
                          Add card
                        </button>
                        <div className="my-1 border-b border-light-300 dark:border-dark-400" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete list "${list.name}" and its cards?`)) {
                              deleteList(activeBoard.id, list.id);
                            }
                            setColumnMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete list</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cards Scrollable Container */}
              <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-2.5 min-h-[3rem]">
                {listCards.map((card) => {
                  const cardLabels = labels.filter((l) => card.labels.includes(l.id));
                  const cardMembers = members.filter((m) => card.members.includes(m.id));
                  const dueDateInfo = formatDueDate(card.dueDate);

                  const totalChecklistItems = card.checklists.reduce((acc, chk) => acc + chk.items.length, 0);
                  const completedChecklistItems = card.checklists.reduce(
                    (acc, chk) => acc + chk.items.filter((i) => i.completed).length,
                    0
                  );

                  const isBeingDragged = draggedCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onDragOver={(e) => handleDragOver(e, list.id, card.id)}
                      onClick={() => openCardModal(card.id)}
                      className={`group relative flex flex-col rounded-lg border border-light-300 dark:border-dark-400/90 bg-light-50 dark:bg-dark-100 p-3 shadow-2xs hover:border-light-400 dark:hover:border-dark-500 hover:shadow-xs transition-all cursor-pointer ${
                        isBeingDragged ? 'opacity-40 scale-95 border-dashed border-indigo-500' : ''
                      }`}
                    >
                      {/* Label Badges */}
                      {cardLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {cardLabels.map((lbl) => (
                            <span
                              key={lbl.id}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border border-transparent ${lbl.bgClass} ${lbl.textClass}`}
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: lbl.colorCode }}
                              />
                              <span>{lbl.name}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Title */}
                      <p className="text-xs font-semibold leading-relaxed text-neutral-900 dark:text-dark-1000 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {card.title}
                      </p>

                      {/* Card Metadata / Badges Footer */}
                      <div className="mt-3 flex items-center justify-between gap-2 pt-1 text-[11px] text-light-800 dark:text-dark-800">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Due date badge */}
                          {dueDateInfo && (
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${dueDateInfo.badgeClass}`}
                            >
                              <Clock className="h-3 w-3" />
                              <span>{dueDateInfo.text}</span>
                            </span>
                          )}

                          {/* Checklists badge */}
                          {totalChecklistItems > 0 && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                                completedChecklistItems === totalChecklistItems
                                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                  : 'text-light-800 dark:text-dark-800'
                              }`}
                            >
                              <CheckSquare className="h-3 w-3" />
                              <span>
                                {completedChecklistItems}/{totalChecklistItems}
                              </span>
                            </span>
                          )}

                          {/* Comments count */}
                          {card.comments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px]">
                              <MessageSquare className="h-3 w-3" />
                              <span>{card.comments.length}</span>
                            </span>
                          )}

                          {/* Attachments count */}
                          {card.attachments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px]">
                              <Paperclip className="h-3 w-3" />
                              <span>{card.attachments.length}</span>
                            </span>
                          )}
                        </div>

                        {/* Assignee Avatars */}
                        {cardMembers.length > 0 && (
                          <div className="flex items-center -space-x-1.5 shrink-0 ml-auto">
                            {cardMembers.map((m) => (
                              <img
                                key={m.id}
                                src={m.avatar}
                                alt={m.name}
                                title={m.name}
                                className="h-5 w-5 rounded-full object-cover ring-1.5 ring-light-50 dark:ring-dark-100"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Inline Quick Add Card Form */}
                {activeAddCardListId === list.id && (
                  <div className="rounded-lg border border-indigo-500/80 bg-light-50 dark:bg-dark-100 p-2.5 shadow-md">
                    <textarea
                      autoFocus
                      rows={2}
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddCardSubmit(list.id);
                        }
                        if (e.key === 'Escape') {
                          setActiveAddCardListId(null);
                          setNewCardTitle('');
                        }
                      }}
                      placeholder="What needs to be done? Press Enter to save..."
                      className="w-full resize-none bg-transparent text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAddCardSubmit(list.id)}
                          className="rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-2xs"
                        >
                          Add card
                        </button>
                        <button
                          onClick={() => {
                            setActiveAddCardListId(null);
                            setNewCardTitle('');
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-light-800 dark:text-dark-800">
                        Enter ↵
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Column Footer: + Add a card */}
              {activeAddCardListId !== list.id && (
                <div className="p-2 pt-1">
                  <button
                    onClick={() => setActiveAddCardListId(list.id)}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200/80 dark:hover:bg-dark-300/80 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add card</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another List Column */}
        <div className="w-[18rem] shrink-0">
          {isAddingColumn ? (
            <form
              onSubmit={handleAddColumnSubmit}
              className="rounded-xl border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200/90 p-3 shadow-sm backdrop-blur-md"
            >
              <input
                type="text"
                autoFocus
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Enter list title..."
                className="w-full rounded-md border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-300 px-3 py-1.5 text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none focus:border-indigo-500"
              />
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!newColumnName.trim()}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  Add list
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingColumn(false)}
                  className="rounded-md p-1 text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-dashed border-light-300 dark:border-dark-400/80 bg-light-100/50 dark:bg-dark-200/30 p-3 text-xs font-semibold text-light-800 dark:text-dark-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-light-100 dark:hover:bg-dark-200 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
