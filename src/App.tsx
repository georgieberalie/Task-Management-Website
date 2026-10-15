import React, { useState, useEffect } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import PatternedBackground from './components/PatternedBackground';
import SideNavigation from './components/SideNavigation';
import BoardHeader from './components/BoardHeader';
import KanbanView from './views/board/KanbanView';
import CalendarView from './views/board/CalendarView';
import TableView from './views/board/TableView';
import BoardsView from './views/boards/BoardsView';
import TemplatesView from './views/templates/TemplatesView';
import SettingsView from './views/settings/SettingsView';
import CardModal from './views/card/CardModal';
import CommandPalette from './components/CommandPalette';
import ShortcutsModal from './components/ShortcutsModal';
import ShareModal from './components/ShareModal';
import ExportBoardModal from './components/ExportBoardModal';
import AuthModal from './components/AuthModal';
import JoinProjectModal from './components/JoinProjectModal';

const MainLayout: React.FC = () => {
  const {
    activePage,
    setActivePage,
    viewMode,
    setActiveBoardId,
    boards,
    openModal,
    closeModal,
    activeModal,
  } = useBoard();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  // Check URL parameters for invite tokens or board slugs
  useEffect(() => {
    const handleUrlState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || urlParams.get('invite');
      if (token) {
        setInviteToken(token);
      }

      const path = window.location.pathname;
      const boardMatch = path.match(/\/boards\/([a-zA-Z0-9_-]+)/);
      if (boardMatch && boardMatch[1]) {
        const boardId = boardMatch[1];
        if (boards.some((b) => b.id === boardId)) {
          setActiveBoardId(boardId);
        }
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    return () => window.removeEventListener('popstate', handleUrlState);
  }, [boards, setActiveBoardId]);

  // Global keyboard shortcuts (G B, G T, G S, ?, Ctrl+K)
  useEffect(() => {
    let chordTimer: any = null;
    let pendingG = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openModal('command-palette');
        return;
      }

      // Shortcuts Modal (?)
      if (e.key === '?') {
        e.preventDefault();
        openModal('shortcuts');
        return;
      }

      // Chorded Navigation: G + (B, T, S)
      if (e.key.toLowerCase() === 'g' && !pendingG) {
        pendingG = true;
        chordTimer = setTimeout(() => {
          pendingG = false;
        }, 800);
        return;
      }

      if (pendingG) {
        const key = e.key.toLowerCase();
        if (key === 'b') {
          e.preventDefault();
          setActivePage('boards');
        } else if (key === 't') {
          e.preventDefault();
          setActivePage('templates');
        } else if (key === 's') {
          e.preventDefault();
          setActivePage('settings');
        }
        pendingG = false;
        if (chordTimer) clearTimeout(chordTimer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (chordTimer) clearTimeout(chordTimer);
    };
  }, [setActivePage, openModal]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-light-50 text-light-1000 dark:bg-dark-50 dark:text-dark-1000">
      {/* Sidebar */}
      <SideNavigation
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main Workspace Frame */}
      <div className="relative flex flex-1 flex-col h-full min-w-0 overflow-hidden md:p-2.5 md:pl-0">
        <main className="relative flex flex-1 flex-col h-full w-full overflow-hidden md:rounded-xl md:border md:border-light-300 md:dark:border-dark-400 bg-light-50 dark:bg-dark-50 shadow-2xs">
          {/* Subtle Dot Grid Canvas Pattern */}
          <PatternedBackground />

          {/* Conditional Content based on activePage */}
          {activePage === 'board' && (
            <>
              <BoardHeader onOpenMobileMenu={() => setMobileNavOpen(true)} />
              {viewMode === 'board' && <KanbanView />}
              {viewMode === 'calendar' && <CalendarView />}
              {viewMode === 'table' && <TableView />}
            </>
          )}

          {activePage === 'boards' && <BoardsView />}
          {activePage === 'templates' && <TemplatesView />}
          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <CardModal />
      <CommandPalette />
      <ShortcutsModal />
      <ShareModal />
      <ExportBoardModal />

      {/* Auth Modal */}
      <AuthModal
        isOpen={activeModal === 'auth'}
        onClose={closeModal}
      />

      {/* Join Project via Invite Token */}
      <JoinProjectModal
        inviteToken={inviteToken}
        onJoined={(projectId) => {
          setActiveBoardId(projectId);
          setInviteToken(null);
          // Clean URL
          window.history.replaceState({}, '', `/boards/${projectId}`);
        }}
        onClose={() => {
          setInviteToken(null);
          window.history.replaceState({}, '', '/');
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BoardProvider>
      <MainLayout />
    </BoardProvider>
  );
};

export default App;
