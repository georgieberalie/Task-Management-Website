import React from 'react';
import { X, Download, FileJson } from 'lucide-react';
import { useBoard } from '../context/BoardContext';

export const ExportBoardModal: React.FC = () => {
  const { activeModal, closeModal, activeBoard, cards } = useBoard();

  if (activeModal !== 'export-board' || !activeBoard) return null;

  const boardCards = cards.filter((c) => c.boardId === activeBoard.id);
  const exportPayload = {
    board: activeBoard,
    cards: boardCards,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeBoard.slug || 'board'}-${activeBoard.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-light-300 dark:border-dark-400 mb-4">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000">
              Export Board JSON
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="rounded p-1 text-light-800 hover:text-neutral-900 dark:hover:text-dark-1000"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-light-800 dark:text-dark-800 mb-3">
          This exports the board structure, columns, cards, labels, and checklists.
        </p>

        <textarea
          readOnly
          value={jsonStr}
          rows={10}
          className="w-full rounded-xl border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 p-3 font-mono text-[11px] text-neutral-900 dark:text-dark-1000 outline-none select-all mb-4 leading-relaxed"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={closeModal}
            className="rounded-lg px-4 py-2 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .json file</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportBoardModal;
