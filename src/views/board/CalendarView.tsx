import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { useBoard } from '../../context/BoardContext';

export const CalendarView: React.FC = () => {
  const { activeBoard, cards, labels, openCardModal, createCard } = useBoard();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!activeBoard) return null;

  const boardCards = cards.filter((c) => c.boardId === activeBoard.id);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Group cards by day string 'YYYY-MM-DD'
  const cardsByDate: { [key: string]: typeof boardCards } = {};
  boardCards.forEach((c) => {
    if (c.dueDate) {
      const dStr = c.dueDate.substring(0, 10);
      if (!cardsByDate[dStr]) cardsByDate[dStr] = [];
      cardsByDate[dStr].push(c);
    }
  });

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5.5rem)] p-4 sm:p-6 overflow-hidden">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-dark-1000">
          {monthName}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200">
            <button
              onClick={prevMonth}
              className="p-1.5 text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-light-800 dark:text-dark-800 hover:text-neutral-900 dark:hover:text-dark-1000"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 rounded-xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/50 backdrop-blur-md flex flex-col overflow-hidden shadow-xs">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-light-300 dark:border-dark-400 bg-light-100/70 dark:bg-dark-200/90 py-2 text-center text-xs font-semibold text-light-800 dark:text-dark-800">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-light-300 dark:divide-dark-400 overflow-y-auto">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="bg-light-100/30 dark:bg-dark-300/10 p-1.5 min-h-[5rem]" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: totalDays }).map((_, dayIdx) => {
            const dayNum = dayIdx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayCards = cardsByDate[dateStr] || [];

            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === dayNum;

            return (
              <div
                key={dayNum}
                className="group relative flex flex-col p-1.5 min-h-[5.5rem] hover:bg-light-100/50 dark:hover:bg-dark-200/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                      isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-neutral-700 dark:text-dark-900'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={() => {
                      const firstListId = activeBoard.lists[0]?.id;
                      if (firstListId) {
                        createCard(activeBoard.id, firstListId, 'New Task').then((newCard) => {
                          openCardModal(newCard.id);
                        });
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-light-800 dark:text-dark-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Add task"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Day Cards list */}
                <div className="space-y-1 overflow-y-auto max-h-24">
                  {dayCards.map((c) => {
                    const cardLabel = labels.find((l) => c.labels.includes(l.id));
                    return (
                      <div
                        key={c.id}
                        onClick={() => openCardModal(c.id)}
                        className="truncate rounded border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 px-1.5 py-1 text-[11px] font-medium text-neutral-900 dark:text-dark-1000 shadow-2xs hover:border-indigo-500 cursor-pointer transition-all"
                      >
                        {cardLabel && (
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full mr-1.5"
                            style={{ backgroundColor: cardLabel.colorCode }}
                          />
                        )}
                        <span>{c.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
