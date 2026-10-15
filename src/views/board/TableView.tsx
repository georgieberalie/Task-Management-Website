import React, { useState } from 'react';
import { Clock, CheckSquare, Tag, User, ArrowUpDown } from 'lucide-react';
import { useBoard } from '../../context/BoardContext';

export const TableView: React.FC = () => {
  const { activeBoard, cards, labels, members, openCardModal } = useBoard();
  const [sortField, setSortField] = useState<'title' | 'list' | 'dueDate'>('title');
  const [sortAsc, setSortAsc] = useState(true);

  if (!activeBoard) return null;

  const boardCards = cards.filter((c) => c.boardId === activeBoard.id);

  const sortedCards = [...boardCards].sort((a, b) => {
    if (sortField === 'title') {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortField === 'list') {
      const listA = activeBoard.lists.find((l) => l.id === a.listId)?.name || '';
      const listB = activeBoard.lists.find((l) => l.id === b.listId)?.name || '';
      return sortAsc ? listA.localeCompare(listB) : listB.localeCompare(listA);
    }
    if (sortField === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortAsc ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const toggleSort = (field: 'title' | 'list' | 'dueDate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5.5rem)] p-4 sm:p-6 overflow-hidden">
      <div className="flex-1 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/50 backdrop-blur-md overflow-hidden flex flex-col shadow-xs">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-light-300 dark:border-dark-400 bg-light-100/80 dark:bg-dark-200 text-light-800 dark:text-dark-800 uppercase tracking-wider font-semibold">
                <th
                  onClick={() => toggleSort('title')}
                  className="p-3 pl-4 cursor-pointer hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Task Title</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('list')}
                  className="p-3 cursor-pointer hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status / List</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3">Labels</th>
                <th
                  onClick={() => toggleSort('dueDate')}
                  className="p-3 cursor-pointer hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3">Checklist</th>
                <th className="p-3 pr-4">Assignees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-300/80 dark:divide-dark-400/80">
              {sortedCards.map((card) => {
                const list = activeBoard.lists.find((l) => l.id === card.listId);
                const cardLabels = labels.filter((l) => card.labels.includes(l.id));
                const cardMembers = members.filter((m) => card.members.includes(m.id));

                const totalItems = card.checklists.reduce((acc, c) => acc + c.items.length, 0);
                const completedItems = card.checklists.reduce(
                  (acc, c) => acc + c.items.filter((i) => i.completed).length,
                  0
                );

                return (
                  <tr
                    key={card.id}
                    onClick={() => openCardModal(card.id)}
                    className="hover:bg-light-100/60 dark:hover:bg-dark-200/60 transition-colors cursor-pointer"
                  >
                    <td className="p-3 pl-4 font-semibold text-neutral-900 dark:text-dark-1000">
                      {card.title}
                    </td>
                    <td className="p-3">
                      <span className="inline-block rounded-md bg-light-200 dark:bg-dark-300 px-2 py-0.5 text-[11px] font-medium text-neutral-800 dark:text-dark-950">
                        {list?.name || 'Backlog'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {cardLabels.map((lbl) => (
                          <span
                            key={lbl.id}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium border border-transparent ${lbl.bgClass} ${lbl.textClass}`}
                          >
                            {lbl.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-light-800 dark:text-dark-800">
                      {card.dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-light-700 dark:text-dark-700">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {totalItems > 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-light-800 dark:text-dark-800">
                          <CheckSquare className="h-3 w-3" />
                          <span>
                            {completedItems}/{totalItems}
                          </span>
                        </div>
                      ) : (
                        <span className="text-light-700 dark:text-dark-700">—</span>
                      )}
                    </td>
                    <td className="p-3 pr-4">
                      <div className="flex items-center -space-x-1.5">
                        {cardMembers.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            title={m.name}
                            className="h-5 w-5 rounded-full object-cover ring-1 ring-light-50 dark:ring-dark-100"
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
