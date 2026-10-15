import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckSquare,
  Clock,
  User,
  Tag,
  Paperclip,
  Trash2,
  Copy,
  Plus,
  Calendar,
  MessageSquare,
  Activity as ActivityIcon,
  Bold,
  Italic,
  List as ListIcon,
  Code,
  Eye,
  Edit3,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBoard } from '../../context/BoardContext';
import { Label, Member } from '../../types';

export const CardModal: React.FC = () => {
  const {
    activeBoard,
    selectedCard,
    closeCardModal,
    updateCard,
    deleteCard,
    duplicateCard,
    addChecklist,
    deleteChecklist,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    addComment,
    deleteComment,
    addAttachment,
    deleteAttachment,
    toggleCardLabel,
    toggleCardMember,
    createLabel,
    labels,
    members,
  } = useBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descPreviewMode, setDescPreviewMode] = useState(false);

  // Popover states
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Form inputs
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [activeChecklistAddId, setActiveChecklistAddId] = useState<string | null>(null);
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#6366f1');

  useEffect(() => {
    if (selectedCard) {
      setTitle(selectedCard.title);
      setDescription(selectedCard.description || '');
      setIsEditingDesc(false);
    }
  }, [selectedCard]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePopover) {
          setActivePopover(null);
        } else {
          closeCardModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePopover, closeCardModal]);

  if (!selectedCard || !activeBoard) return null;

  const currentList = activeBoard.lists.find((l) => l.id === selectedCard.listId);

  const handleTitleBlur = () => {
    if (title.trim() && title !== selectedCard.title) {
      updateCard(selectedCard.id, { title: title.trim() });
    }
  };

  const handleSaveDescription = () => {
    updateCard(selectedCard.id, { description });
    setIsEditingDesc(false);
  };

  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      addChecklist(selectedCard.id, newChecklistTitle.trim());
      setNewChecklistTitle('');
      setActivePopover(null);
    }
  };

  const handleAddChecklistItem = (checklistId: string) => {
    if (newChecklistItemText.trim()) {
      addChecklistItem(selectedCard.id, checklistId, newChecklistItemText.trim());
      setNewChecklistItemText('');
    }
  };

  const handleToggleItem = (checklistId: string, itemId: string) => {
    toggleChecklistItem(selectedCard.id, checklistId, itemId);

    // Check if this action completes the checklist
    const targetChecklist = selectedCard.checklists.find((c) => c.id === checklistId);
    if (targetChecklist) {
      const willBeComplete = targetChecklist.items.every((it) =>
        it.id === itemId ? !it.completed : it.completed
      );
      if (willBeComplete && targetChecklist.items.length > 0) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(selectedCard.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (attachmentName.trim() && attachmentUrl.trim()) {
      addAttachment(selectedCard.id, attachmentName.trim(), attachmentUrl.trim());
      setAttachmentName('');
      setAttachmentUrl('');
      setActivePopover(null);
    }
  };

  const handleCreateNewLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      const created = createLabel(newLabelName.trim(), newLabelColor);
      toggleCardLabel(selectedCard.id, created.id);
      setNewLabelName('');
    }
  };

  const cardLabels = labels.filter((l) => selectedCard.labels.includes(l.id));
  const cardMembers = members.filter((m) => selectedCard.members.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 shadow-2xl overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="flex items-start justify-between border-b border-light-300 dark:border-dark-400 p-4 sm:p-6 pb-4 bg-light-100/60 dark:bg-dark-200/50">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 text-xs text-light-800 dark:text-dark-800 mb-1.5 font-medium">
              <span>in list</span>
              <span className="rounded bg-light-200 dark:bg-dark-300 px-2 py-0.5 font-semibold text-neutral-900 dark:text-dark-1000">
                {currentList?.name || 'List'}
              </span>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full bg-transparent text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-1000 outline-none rounded p-1 -ml-1 focus:bg-light-200/80 dark:focus:bg-dark-200/80 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={closeCardModal}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Active Labels & Members Tags */}
            {(cardLabels.length > 0 || cardMembers.length > 0) && (
              <div className="flex flex-wrap gap-4 pb-2">
                {cardLabels.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase tracking-wide mb-1.5">
                      Labels
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cardLabels.map((lbl) => (
                        <span
                          key={lbl.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border border-transparent ${lbl.bgClass} ${lbl.textClass}`}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: lbl.colorCode }}
                          />
                          <span>{lbl.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cardMembers.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase tracking-wide mb-1.5">
                      Members
                    </p>
                    <div className="flex items-center gap-1.5">
                      {cardMembers.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={m.name}
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-light-300 dark:ring-dark-400"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedCard.dueDate && (
                  <div>
                    <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase tracking-wide mb-1.5">
                      Due Date
                    </p>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-light-200 dark:bg-dark-300 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-dark-950">
                      <Clock className="h-3.5 w-3.5 text-light-800 dark:text-dark-800" />
                      <span>
                        {new Date(selectedCard.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-light-800 dark:text-dark-800" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-dark-1000 uppercase tracking-wider">
                    Description
                  </h4>
                </div>

                {isEditingDesc ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDescPreviewMode(!descPreviewMode)}
                      className="rounded px-2 py-0.5 text-xs text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      {descPreviewMode ? 'Write' : 'Preview'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingDesc(true)}
                    className="rounded bg-light-200 dark:bg-dark-300 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-300 dark:hover:bg-dark-400 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="rounded-xl border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 p-3">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 border-b border-light-300 dark:border-dark-400 pb-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setDescription((prev) => prev + '**Bold**')}
                      className="rounded p-1 text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescription((prev) => prev + '*Italic*')}
                      className="rounded p-1 text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescription((prev) => prev + '\n- Item')}
                      className="rounded p-1 text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      <ListIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescription((prev) => prev + '\n```\ncode\n```')}
                      className="rounded p-1 text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {descPreviewMode ? (
                    <div className="min-h-[6rem] p-2 text-xs leading-relaxed text-neutral-800 dark:text-dark-950 whitespace-pre-wrap">
                      {description || <span className="italic text-light-800 dark:text-dark-800">No content</span>}
                    </div>
                  ) : (
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a more detailed description (Markdown supported)..."
                      className="w-full resize-y bg-transparent text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none font-mono"
                    />
                  )}

                  <div className="mt-2.5 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setDescription(selectedCard.description || '');
                        setIsEditingDesc(false);
                      }}
                      className="rounded px-3 py-1 text-xs text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDescription}
                      className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="min-h-[4rem] rounded-xl border border-light-300/80 dark:border-dark-400/80 bg-light-100/50 dark:bg-dark-200/40 p-3.5 text-xs text-neutral-800 dark:text-dark-950 leading-relaxed cursor-pointer hover:bg-light-100 dark:hover:bg-dark-200/60 transition-colors whitespace-pre-wrap"
                >
                  {description || (
                    <span className="text-light-800 dark:text-dark-800 italic">
                      Add a more detailed description...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Checklists Section */}
            {selectedCard.checklists.map((chk) => {
              const total = chk.items.length;
              const completed = chk.items.filter((i) => i.completed).length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={chk.id} className="rounded-xl border border-light-300 dark:border-dark-400 p-4 bg-light-50 dark:bg-dark-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-indigo-500" />
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-dark-1000">
                        {chk.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => deleteChecklist(selectedCard.id, chk.id)}
                      className="text-light-800 dark:text-dark-800 hover:text-red-500 text-xs p-1"
                      title="Delete checklist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-light-800 dark:text-dark-800 w-8">
                      {percentage}%
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-light-200 dark:bg-dark-300 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          percentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 mb-2.5">
                    {chk.items.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-start justify-between gap-2 rounded-lg p-1.5 hover:bg-light-100 dark:hover:bg-dark-200/80 transition-colors"
                      >
                        <label className="flex items-start gap-2.5 flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleItem(chk.id, item.id)}
                            className="mt-0.5 h-4 w-4 rounded border-light-400 dark:border-dark-400 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span
                            className={`text-xs leading-normal ${
                              item.completed
                                ? 'line-through text-light-800 dark:text-dark-800'
                                : 'text-neutral-900 dark:text-dark-1000'
                            }`}
                          >
                            {item.text}
                          </span>
                        </label>

                        <button
                          onClick={() => deleteChecklistItem(selectedCard.id, chk.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-light-800 dark:text-dark-800 hover:text-red-500 transition-opacity p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add item inline */}
                  {activeChecklistAddId === chk.id ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        autoFocus
                        value={newChecklistItemText}
                        onChange={(e) => setNewChecklistItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddChecklistItem(chk.id);
                          if (e.key === 'Escape') setActiveChecklistAddId(null);
                        }}
                        placeholder="Add an item..."
                        className="w-full rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-3 py-1.5 text-xs text-neutral-900 dark:text-dark-1000 outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddChecklistItem(chk.id)}
                          className="rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setActiveChecklistAddId(null)}
                          className="rounded p-1 text-xs text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveChecklistAddId(chk.id)}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-300 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add item</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Attachments Section */}
            {selectedCard.attachments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-light-800 dark:text-dark-800" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-dark-1000 uppercase tracking-wider">
                    Attachments
                  </h4>
                </div>

                <div className="space-y-2">
                  {selectedCard.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 p-2.5"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-indigo-500">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block"
                          >
                            {att.name}
                          </a>
                          <span className="text-[10px] text-light-800 dark:text-dark-800">
                            Added {new Date(att.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAttachment(selectedCard.id, att.id)}
                        className="text-light-800 dark:text-dark-800 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments & Activity Section */}
            <div className="pt-2 border-t border-light-300 dark:border-dark-400">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-light-800 dark:text-dark-800" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-dark-1000 uppercase tracking-wider">
                  Comments & Activity
                </h4>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2.5 mb-4">
                <img
                  src={members[0]?.avatar}
                  alt={members[0]?.name}
                  className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-light-300 dark:ring-dark-400"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs text-neutral-900 dark:text-dark-1000 placeholder-light-800 dark:placeholder-dark-800 outline-none focus:border-indigo-500"
                  />
                  {commentText && (
                    <button
                      type="submit"
                      className="mt-2 rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Save comment
                    </button>
                  )}
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3">
                {selectedCard.comments.map((cm) => {
                  const author = members.find((m) => m.id === cm.authorId) || members[0];
                  return (
                    <div key={cm.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100/60 dark:bg-dark-200/50 p-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-neutral-900 dark:text-dark-1000">
                            {author.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-light-800 dark:text-dark-800">
                              {new Date(cm.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <button
                              onClick={() => deleteComment(selectedCard.id, cm.id)}
                              className="text-light-800 dark:text-dark-800 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-neutral-800 dark:text-dark-950 leading-relaxed">
                          {cm.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Audit Activity entries */}
                {selectedCard.activity.map((act) => {
                  const author = members.find((m) => m.id === act.authorId) || members[0];
                  return (
                    <div key={act.id} className="flex items-center gap-2 text-[11px] text-light-800 dark:text-dark-800 pl-8">
                      <span className="font-medium text-neutral-800 dark:text-dark-900">{author.name}</span>
                      <span>{act.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Rail: Action Buttons */}
          <div className="space-y-5">
            {/* Add to Card actions */}
            <div>
              <p className="text-[11px] font-bold text-light-800 dark:text-dark-800 uppercase tracking-wider mb-2">
                Add to card
              </p>
              <div className="space-y-1.5">
                {/* Members Button */}
                <div className="relative">
                  <button
                    onClick={() => setActivePopover(activePopover === 'members' ? null : 'members')}
                    className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Members</span>
                  </button>

                  {activePopover === 'members' && (
                    <div className="absolute left-0 right-0 top-9 z-40 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-2 shadow-xl">
                      <p className="px-2 py-1 text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase">
                        Assign Members
                      </p>
                      <div className="space-y-1 mt-1">
                        {members.map((m) => {
                          const isAssigned = selectedCard.members.includes(m.id);
                          return (
                            <button
                              key={m.id}
                              onClick={() => toggleCardMember(selectedCard.id, m.id)}
                              className="flex w-full items-center justify-between rounded-md p-1.5 text-xs text-neutral-900 dark:text-dark-1000 hover:bg-light-200 dark:hover:bg-dark-200"
                            >
                              <div className="flex items-center gap-2">
                                <img src={m.avatar} alt={m.name} className="h-5 w-5 rounded-full object-cover" />
                                <span>{m.name}</span>
                              </div>
                              {isAssigned && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Labels Button */}
                <div className="relative">
                  <button
                    onClick={() => setActivePopover(activePopover === 'labels' ? null : 'labels')}
                    className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span>Labels</span>
                  </button>

                  {activePopover === 'labels' && (
                    <div className="absolute left-0 right-0 top-9 z-40 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-2.5 shadow-xl w-60">
                      <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase mb-2">
                        Select Labels
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto mb-2">
                        {labels.map((lbl) => {
                          const isSelected = selectedCard.labels.includes(lbl.id);
                          return (
                            <button
                              key={lbl.id}
                              onClick={() => toggleCardLabel(selectedCard.id, lbl.id)}
                              className="flex w-full items-center justify-between rounded-md p-1.5 text-xs hover:bg-light-200 dark:hover:bg-dark-200"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: lbl.colorCode }}
                                />
                                <span className="font-medium text-neutral-800 dark:text-dark-1000">
                                  {lbl.name}
                                </span>
                              </div>
                              {isSelected && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Create new label */}
                      <form onSubmit={handleCreateNewLabel} className="pt-2 border-t border-light-300 dark:border-dark-400">
                        <input
                          type="text"
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                          placeholder="Create new label..."
                          className="w-full rounded border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2 py-1 text-xs outline-none text-neutral-900 dark:text-dark-1000 mb-1.5"
                        />
                        <div className="flex items-center gap-1.5 mb-2">
                          {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map((c) => (
                            <button
                              type="button"
                              key={c}
                              onClick={() => setNewLabelColor(c)}
                              className={`h-4 w-4 rounded-full transition-transform ${
                                newLabelColor === c ? 'scale-125 ring-2 ring-indigo-500' : ''
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <button
                          type="submit"
                          disabled={!newLabelName.trim()}
                          className="w-full rounded bg-indigo-600 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                          Add label
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Checklist Button */}
                <div className="relative">
                  <button
                    onClick={() => setActivePopover(activePopover === 'checklist' ? null : 'checklist')}
                    className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>Checklist</span>
                  </button>

                  {activePopover === 'checklist' && (
                    <div className="absolute left-0 right-0 top-9 z-40 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-3 shadow-xl w-56">
                      <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase mb-2">
                        Add Checklist
                      </p>
                      <form onSubmit={handleCreateChecklist}>
                        <input
                          type="text"
                          autoFocus
                          value={newChecklistTitle}
                          onChange={(e) => setNewChecklistTitle(e.target.value)}
                          placeholder="Checklist title..."
                          className="w-full rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2.5 py-1.5 text-xs outline-none text-neutral-900 dark:text-dark-1000 mb-2"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-md bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                          Add
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Dates Button */}
                <div className="relative">
                  <button
                    onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
                    className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Dates</span>
                  </button>

                  {activePopover === 'dates' && (
                    <div className="absolute left-0 right-0 top-9 z-40 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-3 shadow-xl w-56">
                      <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase mb-2">
                        Due Date
                      </p>
                      <input
                        type="date"
                        value={selectedCard.dueDate ? selectedCard.dueDate.substring(0, 10) : ''}
                        onChange={(e) =>
                          updateCard(selectedCard.id, {
                            dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                          })
                        }
                        className="w-full rounded border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2 py-1 text-xs text-neutral-900 dark:text-dark-1000 mb-2 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => {
                            updateCard(selectedCard.id, { dueDate: new Date().toISOString() });
                            setActivePopover(null);
                          }}
                          className="rounded bg-light-200 dark:bg-dark-300 py-1 text-[11px] font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-300"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => {
                            const tmrw = new Date();
                            tmrw.setDate(tmrw.getDate() + 1);
                            updateCard(selectedCard.id, { dueDate: tmrw.toISOString() });
                            setActivePopover(null);
                          }}
                          className="rounded bg-light-200 dark:bg-dark-300 py-1 text-[11px] font-medium text-neutral-800 dark:text-dark-950 hover:bg-light-300"
                        >
                          Tomorrow
                        </button>
                      </div>
                      {selectedCard.dueDate && (
                        <button
                          onClick={() => {
                            updateCard(selectedCard.id, { dueDate: null });
                            setActivePopover(null);
                          }}
                          className="w-full mt-2 rounded py-1 text-[11px] text-red-500 hover:bg-red-500/10"
                        >
                          Remove due date
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Attachment Button */}
                <div className="relative">
                  <button
                    onClick={() => setActivePopover(activePopover === 'attachment' ? null : 'attachment')}
                    className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Attachment</span>
                  </button>

                  {activePopover === 'attachment' && (
                    <div className="absolute left-0 right-0 top-9 z-40 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-3 shadow-xl w-60">
                      <p className="text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase mb-2">
                        Attach Link or File
                      </p>
                      <form onSubmit={handleAddAttachment} className="space-y-2">
                        <input
                          type="text"
                          value={attachmentName}
                          onChange={(e) => setAttachmentName(e.target.value)}
                          placeholder="File name or label..."
                          className="w-full rounded border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2 py-1 text-xs outline-none text-neutral-900 dark:text-dark-1000"
                        />
                        <input
                          type="text"
                          value={attachmentUrl}
                          onChange={(e) => setAttachmentUrl(e.target.value)}
                          placeholder="Link URL (https://...)..."
                          className="w-full rounded border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2 py-1 text-xs outline-none text-neutral-900 dark:text-dark-1000"
                        />
                        <button
                          type="submit"
                          disabled={!attachmentName.trim() || !attachmentUrl.trim()}
                          className="w-full rounded bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                          Attach
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions group */}
            <div>
              <p className="text-[11px] font-bold text-light-800 dark:text-dark-800 uppercase tracking-wider mb-2">
                Actions
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    duplicateCard(selectedCard.id);
                    closeCardModal();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors shadow-2xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy card</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete card "${selectedCard.title}"?`)) {
                      deleteCard(selectedCard.id);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
