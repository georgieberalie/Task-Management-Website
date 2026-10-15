import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Command,
  HelpCircle,
  Star,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { useBoard, ActivePage } from '../context/BoardContext';

interface SideNavigationProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentUser,
    activePage,
    setActivePage,
    boards,
    activeBoardId,
    setActiveBoardId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    theme,
    toggleTheme,
    openModal,
    signOut,
    isCloudConnected,
  } = useBoard();

  const navItems = [
    { id: 'boards', label: 'Boards', icon: LayoutDashboard, shortcut: 'B' },
    { id: 'templates', label: 'Templates', icon: Layers, shortcut: 'T' },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'S' },
  ];

  const starredBoards = boards.filter((b) => b.isStarred);

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId as ActivePage);
    setMobileOpen(false);
  };

  const handleBoardClick = (boardId: string) => {
    setActiveBoardId(boardId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:relative z-40 top-0 bottom-0 left-0 flex flex-col justify-between border-r border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-100 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-[68px]' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen select-none`}
      >
        {/* Top Header */}
        <div className="flex flex-col p-3 pb-0">
          <div className="flex h-11 items-center justify-between px-1">
            <button
              onClick={() => handleNavClick('board')}
              className={`flex items-center gap-2.5 overflow-hidden transition-opacity hover:opacity-85 ${
                isSidebarCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/20 text-xs">
                T
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold tracking-tight text-neutral-900 dark:text-dark-1000">
                    ToDo
                  </span>
                  <span
                    title={isCloudConnected ? 'Connected to Cloud' : 'Local mode'}
                    className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      isCloudConnected
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-light-300 text-light-900 dark:bg-dark-300 dark:text-dark-800'
                    }`}
                  >
                    {isCloudConnected ? <Cloud className="h-2.5 w-2.5" /> : <CloudOff className="h-2.5 w-2.5" />}
                    <span>{isCloudConnected ? 'Cloud' : 'Local'}</span>
                  </span>
                </div>
              )}
            </button>

            {/* Collapse toggle button */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                title="Collapse sidebar"
                className="hidden md:flex h-8 w-8 items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Collapsed expand button */}
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              title="Expand sidebar"
              className="mt-2 hidden md:flex h-8 w-full items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          <div className="my-3 border-b border-light-300 dark:border-dark-400" />

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`group flex h-9 w-full items-center rounded-md px-2.5 text-sm font-medium transition-all ${
                    isSidebarCollapsed ? 'justify-center' : 'justify-between'
                  } ${
                    isSelected
                      ? 'bg-light-200 text-neutral-900 dark:bg-dark-200 dark:text-dark-1000 font-semibold shadow-2xs'
                      : 'text-neutral-600 dark:text-dark-900 hover:bg-light-200/70 hover:text-neutral-900 dark:hover:bg-dark-200/60 dark:hover:text-dark-1000'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <kbd className="inline-flex h-4.5 w-4.5 items-center justify-center rounded border border-light-400 bg-light-100 dark:border-dark-400 dark:bg-dark-300 font-mono text-[9px] text-light-900 dark:text-dark-900 font-semibold">
                        G
                      </kbd>
                      <kbd className="inline-flex h-4.5 w-4.5 items-center justify-center rounded border border-light-400 bg-light-100 dark:border-dark-400 dark:bg-dark-300 font-mono text-[9px] text-light-900 dark:text-dark-900 font-semibold">
                        {item.shortcut}
                      </kbd>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Starred Boards Section */}
          {!isSidebarCollapsed && starredBoards.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-light-800 dark:text-dark-800 uppercase tracking-wider">
                <span>Starred</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </div>
              <div className="mt-1 space-y-0.5">
                {starredBoards.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBoardClick(b.id)}
                    className={`group flex h-8 w-full items-center justify-between rounded-md px-2.5 text-xs transition-colors ${
                      activeBoardId === b.id && activePage === 'board'
                        ? 'bg-light-200/80 font-medium text-neutral-900 dark:bg-dark-200 dark:text-dark-1000'
                        : 'text-neutral-600 dark:text-dark-900 hover:bg-light-200/50 dark:hover:bg-dark-200/40 hover:text-neutral-900 dark:hover:text-dark-1000'
                    }`}
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom User & Utility Controls */}
        <div className="p-3 border-t border-light-300 dark:border-dark-400 space-y-2">
          {/* Quick Actions Bar */}
          <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'flex-col' : 'justify-between'}`}>
            <button
              onClick={() => openModal('shortcuts')}
              title="Keyboard shortcuts (?)"
              className="flex h-8 w-8 items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => openModal('command-palette')}
              title="Command palette (Ctrl+K)"
              className="flex h-8 w-8 items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
            >
              <Command className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-light-900 dark:text-dark-900 hover:bg-light-200 dark:hover:bg-dark-200 hover:text-neutral-900 dark:hover:text-dark-1000 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* User Profile Card or Sign In Button */}
          {currentUser ? (
            <div
              className={`flex items-center justify-between rounded-lg border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-200/50 p-2 transition-colors ${
                isSidebarCollapsed ? 'justify-center p-1' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={
                    currentUser.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`
                  }
                  alt={currentUser.displayName || currentUser.email}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-light-400 dark:ring-dark-500 shrink-0"
                />
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <p className="truncate text-xs font-semibold text-neutral-900 dark:text-dark-1000 leading-tight">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </p>
                    <p className="truncate text-[10px] text-light-800 dark:text-dark-800">
                      {currentUser.email}
                    </p>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="rounded p-1 text-light-800 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => openModal('auth')}
                className={`flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 p-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-2xs transition-colors ${
                  isSidebarCollapsed ? 'p-2' : 'px-3'
                }`}
                title="Sign in / Register"
              >
                <LogIn className="h-3.5 w-3.5" />
                {!isSidebarCollapsed && <span>Sign In</span>}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;
