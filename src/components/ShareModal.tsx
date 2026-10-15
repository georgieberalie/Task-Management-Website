import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Eye, Share2, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { useBoard } from '../context/BoardContext';

export const ShareModal: React.FC = () => {
  const { activeModal, closeModal, activeBoard, updateBoard, createInviteLink } = useBoard();
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeModal === 'share-board' && activeBoard) {
      setLoading(true);
      createInviteLink(activeBoard.id)
        .then((url) => setInviteUrl(url))
        .catch(() => setInviteUrl(`${window.location.origin}/boards/${activeBoard.id}`))
        .finally(() => setLoading(false));
    }
  }, [activeModal, activeBoard]);

  if (activeModal !== 'share-board' || !activeBoard) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-light-300 dark:border-dark-400 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000">
              Invite to: {activeBoard.title}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="rounded p-1 text-light-800 hover:text-neutral-900 dark:hover:text-dark-1000"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-light-800 dark:text-dark-800 mb-4 leading-relaxed">
          Anyone with this link will be added directly to <strong>this project only</strong>. They will not be able to see any of your other private projects, and they can create their own boards.
        </p>

        {/* Invite Link Box */}
        <div className="flex items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 p-2 mb-4">
          <LinkIcon className="h-4 w-4 text-light-800 dark:text-dark-800 shrink-0 ml-1" />
          <input
            type="text"
            readOnly
            value={loading ? 'Generating invite link...' : inviteUrl}
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-dark-1000 outline-none select-all font-mono"
          />
          <button
            onClick={handleCopy}
            disabled={loading || !inviteUrl}
            className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shrink-0 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 rounded-xl border border-light-300 dark:border-dark-400 p-3 bg-light-100/50 dark:bg-dark-200/50 text-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-neutral-900 dark:text-dark-1000">Project-Scoped Access</p>
            <p className="text-[11px] text-light-800 dark:text-dark-800">
              Row-Level Security isolates your data. Users only access the boards they belong to.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
