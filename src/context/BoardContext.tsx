import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Board, Card, Workspace, Member, Label, Checklist, ChecklistItem, Comment, Attachment, AuthUser } from '../types';
import { INITIAL_BOARDS, INITIAL_CARDS, INITIAL_WORKSPACE, INITIAL_LABELS, INITIAL_TEMPLATES } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  BOARDS: 'kanbn_boards_clean_v1',
  CARDS: 'kanbn_cards_clean_v1',
  ACTIVE_BOARD: 'kanbn_active_board_clean_v1',
  THEME: 'kanbn_theme_v1',
  SIDEBAR_COLLAPSED: 'kanbn_sidebar_collapsed_v1',
};

export type ActivePage = 'boards' | 'board' | 'templates' | 'members' | 'settings';
export type BoardViewMode = 'board' | 'calendar' | 'table';

interface BoardContextType {
  currentUser: AuthUser | null;
  boards: Board[];
  cards: Card[];
  workspace: Workspace;
  members: Member[];
  labels: Label[];
  activeBoardId: string;
  activeBoard: Board | null;
  activePage: ActivePage;
  viewMode: BoardViewMode;
  searchQuery: string;
  selectedLabelFilter: string | null;
  selectedMemberFilter: string | null;
  isSidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  selectedCardId: string | null;
  selectedCard: Card | null;
  activeModal: string | null;
  modalData: any;
  isCloudConnected: boolean;

  // Actions
  setActivePage: (page: ActivePage) => void;
  setActiveBoardId: (id: string) => void;
  setViewMode: (mode: BoardViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLabelFilter: (labelId: string | null) => void;
  setSelectedMemberFilter: (memberId: string | null) => void;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  openCardModal: (cardId: string) => void;
  closeCardModal: () => void;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  signOut: () => Promise<void>;

  // Board operations
  createBoard: (title: string, visibility?: Board['visibility'], description?: string) => Promise<string>;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  toggleStarBoard: (boardId: string) => void;
  createInviteLink: (boardId: string) => Promise<string>;

  // List operations
  createList: (boardId: string, name: string) => Promise<void>;
  updateList: (boardId: string, listId: string, name: string) => Promise<void>;
  deleteList: (boardId: string, listId: string) => Promise<void>;
  reorderLists: (boardId: string, startIndex: number, endIndex: number) => void;

  // Card operations
  createCard: (boardId: string, listId: string, title: string) => Promise<Card>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  duplicateCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, targetListId: string, targetIndex?: number) => Promise<void>;

  // Card sub-entity operations
  addChecklist: (cardId: string, title: string) => void;
  deleteChecklist: (cardId: string, checklistId: string) => void;
  addChecklistItem: (cardId: string, checklistId: string, text: string) => void;
  toggleChecklistItem: (cardId: string, checklistId: string, itemId: string) => void;
  deleteChecklistItem: (cardId: string, checklistId: string, itemId: string) => void;
  addComment: (cardId: string, text: string) => void;
  deleteComment: (cardId: string, commentId: string) => void;
  addAttachment: (cardId: string, name: string, url: string, type?: string) => void;
  deleteAttachment: (cardId: string, attachmentId: string) => void;
  toggleCardLabel: (cardId: string, labelId: string) => void;
  toggleCardMember: (cardId: string, memberId: string) => void;

  createLabel: (name: string, colorCode: string) => Label;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAllData: () => void;

  // Template instantiation
  useTemplate: (templateId: string) => Promise<string>;

  // Refresh
  refreshFromCloud: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [boards, setBoards] = useState<Board[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARDS);
      return saved ? JSON.parse(saved) : INITIAL_BOARDS;
    } catch {
      return INITIAL_BOARDS;
    }
  });

  const [cards, setCards] = useState<Card[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
      return saved ? JSON.parse(saved) : INITIAL_CARDS;
    } catch {
      return INITIAL_CARDS;
    }
  });

  const [activeBoardId, setActiveBoardIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_BOARD);
      return saved || 'xwb53k51huwr';
    } catch {
      return 'xwb53k51huwr';
    }
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('board');
  const [viewMode, setViewMode] = useState<BoardViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string | null>(null);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Check Supabase Auth State
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch from Supabase when user is logged in
  const refreshFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured || !currentUser) return;

    try {
      // 1. Fetch projects user belongs to
      const { data: projectsData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projErr) throw projErr;

      if (projectsData && projectsData.length > 0) {
        // Fetch lists for all these projects
        const projectIds = projectsData.map((p) => p.id);
        const { data: listsData } = await supabase
          .from('lists')
          .select('*')
          .in('project_id', projectIds)
          .order('position', { ascending: true });

        // Fetch cards for these projects
        const { data: cardsData } = await supabase
          .from('cards')
          .select('*')
          .in('project_id', projectIds)
          .order('position', { ascending: true });

        const mappedBoards: Board[] = projectsData.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          workspaceId: 'ws_cloud',
          visibility: p.visibility as any,
          isStarred: p.is_starred || false,
          createdAt: p.created_at,
          description: p.description || '',
          labels: INITIAL_LABELS,
          createdBy: p.created_by,
          lists: (listsData || [])
            .filter((l) => l.project_id === p.id)
            .map((l) => ({
              id: l.id,
              boardId: l.project_id,
              name: l.name,
              position: l.position || 0,
            })),
        }));

        const mappedCards: Card[] = (cardsData || []).map((c) => ({
          id: c.id,
          boardId: c.project_id,
          listId: c.list_id,
          title: c.title,
          description: c.description || '',
          position: c.position || 0,
          dueDate: c.due_date,
          labels: Array.isArray(c.labels) ? c.labels : [],
          members: Array.isArray(c.members) ? c.members : [],
          checklists: Array.isArray(c.checklists) ? c.checklists : [],
          comments: Array.isArray(c.comments) ? c.comments : [],
          attachments: Array.isArray(c.attachments) ? c.attachments : [],
          activity: [],
          createdAt: c.created_at,
        }));

        setBoards(mappedBoards);
        setCards(mappedCards);

        if (!mappedBoards.some((b) => b.id === activeBoardId)) {
          setActiveBoardIdState(mappedBoards[0].id);
        }
      } else {
        setBoards([]);
        setCards([]);
      }
    } catch (err) {
      console.error('Failed to load projects from cloud:', err);
    }
  }, [currentUser, activeBoardId]);

  useEffect(() => {
    refreshFromCloud();
  }, [refreshFromCloud]);

  // Sync to LocalStorage as cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
    } catch {}
  }, [boards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BOARD, activeBoardId);
    } catch {}
  }, [activeBoardId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(isSidebarCollapsed));
    } catch {}
  }, [isSidebarCollapsed]);

  const activeBoard = useMemo(() => {
    return boards.find((b) => b.id === activeBoardId) || boards[0] || null;
  }, [boards, activeBoardId]);

  const selectedCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || null;
  }, [cards, selectedCardId]);

  const workspace: Workspace = useMemo(() => {
    return {
      id: 'ws_current',
      name: currentUser ? `${currentUser.displayName || 'My'}'s Workspace` : 'Local Workspace',
      slug: 'workspace',
      icon: '⚡',
      members: currentUser
        ? [
            {
              id: currentUser.id,
              name: currentUser.displayName || currentUser.email,
              email: currentUser.email,
              avatar: currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`,
              role: 'admin',
            },
          ]
        : [],
    };
  }, [currentUser]);

  const members = workspace.members;
  const labels = activeBoard?.labels || INITIAL_LABELS;

  const setActiveBoardId = (id: string) => {
    setActiveBoardIdState(id);
    setActivePage('board');
  };

  const setTheme = (newTheme: 'dark' | 'light') => setThemeState(newTheme);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const openCardModal = (cardId: string) => {
    setSelectedCardId(cardId);
    setActiveModal('card-detail');
  };

  const closeCardModal = () => {
    setSelectedCardId(null);
    if (activeModal === 'card-detail') setActiveModal(null);
  };

  const openModal = (modalName: string, data?: any) => {
    setActiveModal(modalName);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setBoards(INITIAL_BOARDS);
    setCards(INITIAL_CARDS);
    setActiveBoardId('xwb53k51huwr');
  };

  // Board CRUD with Cloud sync
  const createBoard = async (
    title: string,
    visibility: Board['visibility'] = 'private',
    description = ''
  ): Promise<string> => {
    if (isSupabaseConfigured && currentUser) {
      const { data: newProj, error } = await supabase
        .from('projects')
        .insert({
          title,
          visibility,
          description,
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating board in Supabase:', error);
        throw error;
      }

      await refreshFromCloud();
      setActiveBoardId(newProj.id);
      return newProj.id;
    }

    // Local fallback
    const newId = 'brd_' + Math.random().toString(36).substring(2, 9);
    const newBoard: Board = {
      id: newId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      workspaceId: workspace.id,
      visibility,
      isStarred: false,
      createdAt: new Date().toISOString(),
      description,
      labels: INITIAL_LABELS,
      lists: [
        { id: `lst_${newId}_1`, boardId: newId, name: 'To Do', position: 0 },
        { id: `lst_${newId}_2`, boardId: newId, name: 'In Progress', position: 1 },
        { id: `lst_${newId}_3`, boardId: newId, name: 'Done', position: 2 },
      ],
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newId);
    return newId;
  };

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, ...updates } : b))
    );

    if (isSupabaseConfigured && currentUser) {
      await supabase
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          visibility: updates.visibility,
          is_starred: updates.isStarred,
        })
        .eq('id', boardId);
    }
  };

  const deleteBoard = async (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setCards((prev) => prev.filter((c) => c.boardId !== boardId));

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('projects').delete().eq('id', boardId);
    }

    const next = boards.find((b) => b.id !== boardId);
    if (next) setActiveBoardId(next.id);
  };

  const toggleStarBoard = (boardId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, isStarred: !b.isStarred } : b))
    );
  };

  // Create Project Invite Link
  const createInviteLink = async (boardId: string): Promise<string> => {
    const token = 'inv_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

    if (isSupabaseConfigured && currentUser) {
      const { error } = await supabase.from('project_invites').insert({
        token,
        project_id: boardId,
        created_by: currentUser.id,
        role: 'member',
      });

      if (error) {
        console.error('Failed to create invite token:', error);
      }
    }

    return `${window.location.origin}/join?token=${token}`;
  };

  // List Operations
  const createList = async (boardId: string, name: string) => {
    if (isSupabaseConfigured && currentUser) {
      const { data: newList } = await supabase
        .from('lists')
        .insert({
          project_id: boardId,
          name,
          position: (activeBoard?.lists.length || 0),
        })
        .select()
        .single();

      if (newList) {
        await refreshFromCloud();
        return;
      }
    }

    const listId = 'lst_' + Math.random().toString(36).substring(2, 9);
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          lists: [...b.lists, { id: listId, boardId, name, position: b.lists.length }],
        };
      })
    );
  };

  const updateList = async (boardId: string, listId: string, name: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, lists: b.lists.map((l) => (l.id === listId ? { ...l, name } : l)) }
          : b
      )
    );

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('lists').update({ name }).eq('id', listId);
    }
  };

  const deleteList = async (boardId: string, listId: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId ? { ...b, lists: b.lists.filter((l) => l.id !== listId) } : b
      )
    );
    setCards((prev) => prev.filter((c) => c.listId !== listId));

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('lists').delete().eq('id', listId);
    }
  };

  const reorderLists = (_boardId: string, _startIndex: number, _endIndex: number) => {
    // Reordering within board
  };

  // Card Operations
  const createCard = async (boardId: string, listId: string, title: string): Promise<Card> => {
    if (isSupabaseConfigured && currentUser) {
      const listCards = cards.filter((c) => c.listId === listId);
      const { data: newCard, error } = await supabase
        .from('cards')
        .insert({
          project_id: boardId,
          list_id: listId,
          title: title.trim(),
          description: '',
          position: listCards.length,
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating card:', error);
      } else if (newCard) {
        await refreshFromCloud();
        return {
          id: newCard.id,
          boardId,
          listId,
          title: newCard.title,
          description: '',
          position: newCard.position,
          labels: [],
          members: [],
          dueDate: null,
          checklists: [],
          comments: [],
          attachments: [],
          activity: [],
          createdAt: newCard.created_at,
        };
      }
    }

    const newId = 'crd_' + Math.random().toString(36).substring(2, 9);
    const card: Card = {
      id: newId,
      boardId,
      listId,
      title: title.trim(),
      description: '',
      position: cards.filter((c) => c.listId === listId).length,
      labels: [],
      members: [],
      dueDate: null,
      checklists: [],
      comments: [],
      attachments: [],
      activity: [],
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [...prev, card]);
    return card;
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
    );

    if (isSupabaseConfigured && currentUser) {
      await supabase
        .from('cards')
        .update({
          title: updates.title,
          description: updates.description,
          due_date: updates.dueDate,
          labels: updates.labels,
          members: updates.members,
          checklists: updates.checklists,
          comments: updates.comments,
          attachments: updates.attachments,
        })
        .eq('id', cardId);
    }
  };

  const deleteCard = async (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    if (selectedCardId === cardId) closeCardModal();

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('cards').delete().eq('id', cardId);
    }
  };

  const duplicateCard = async (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    await createCard(card.boardId, card.listId, `${card.title} (Copy)`);
  };

  const moveCard = async (cardId: string, targetListId: string, targetIndex?: number) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card) return prev;

      const otherCards = prev.filter((c) => c.id !== cardId);
      const targetListCards = otherCards
        .filter((c) => c.listId === targetListId)
        .sort((a, b) => a.position - b.position);

      const insertIndex = targetIndex !== undefined ? targetIndex : targetListCards.length;
      targetListCards.splice(insertIndex, 0, {
        ...card,
        listId: targetListId,
      });

      const updatedListCards = targetListCards.map((c, idx) => ({ ...c, position: idx }));
      const nonTargetCards = otherCards.filter((c) => c.listId !== targetListId);
      return [...nonTargetCards, ...updatedListCards];
    });

    if (isSupabaseConfigured && currentUser) {
      await supabase
        .from('cards')
        .update({
          list_id: targetListId,
          position: targetIndex !== undefined ? targetIndex : 0,
        })
        .eq('id', cardId);
    }
  };

  // Checklists
  const addChecklist = (cardId: string, title: string) => {
    const newChecklist: Checklist = {
      id: 'chk_' + Math.random().toString(36).substring(2, 7),
      title: title.trim() || 'Checklist',
      items: [],
    };
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      updateCard(cardId, { checklists: [...card.checklists, newChecklist] });
    }
  };

  const deleteChecklist = (cardId: string, checklistId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      updateCard(cardId, {
        checklists: card.checklists.filter((chk) => chk.id !== checklistId),
      });
    }
  };

  const addChecklistItem = (cardId: string, checklistId: string, text: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const newItem: ChecklistItem = {
      id: 'item_' + Math.random().toString(36).substring(2, 7),
      text: text.trim(),
      completed: false,
    };

    const updated = card.checklists.map((chk) =>
      chk.id === checklistId ? { ...chk, items: [...chk.items, newItem] } : chk
    );
    updateCard(cardId, { checklists: updated });
  };

  const toggleChecklistItem = (cardId: string, checklistId: string, itemId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const updated = card.checklists.map((chk) =>
      chk.id === checklistId
        ? {
            ...chk,
            items: chk.items.map((it) =>
              it.id === itemId ? { ...it, completed: !it.completed } : it
            ),
          }
        : chk
    );
    updateCard(cardId, { checklists: updated });
  };

  const deleteChecklistItem = (cardId: string, checklistId: string, itemId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const updated = card.checklists.map((chk) =>
      chk.id === checklistId
        ? { ...chk, items: chk.items.filter((it) => it.id !== itemId) }
        : chk
    );
    updateCard(cardId, { checklists: updated });
  };

  // Comments (Real user comments)
  const addComment = (cardId: string, text: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || !text.trim()) return;

    const newComment: Comment = {
      id: 'cm_' + Math.random().toString(36).substring(2, 7),
      authorId: currentUser?.id || 'usr_me',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    updateCard(cardId, { comments: [newComment, ...card.comments] });
  };

  const deleteComment = (cardId: string, commentId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      updateCard(cardId, {
        comments: card.comments.filter((cm) => cm.id !== commentId),
      });
    }
  };

  // Attachments
  const addAttachment = (cardId: string, name: string, url: string, type = 'document') => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const newAttachment: Attachment = {
      id: 'att_' + Math.random().toString(36).substring(2, 7),
      name,
      url,
      type,
      size: 'Document',
      createdAt: new Date().toISOString(),
    };

    updateCard(cardId, { attachments: [...card.attachments, newAttachment] });
  };

  const deleteAttachment = (cardId: string, attachmentId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      updateCard(cardId, {
        attachments: card.attachments.filter((a) => a.id !== attachmentId),
      });
    }
  };

  const toggleCardLabel = (cardId: string, labelId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const exists = card.labels.includes(labelId);
    updateCard(cardId, {
      labels: exists ? card.labels.filter((l) => l !== labelId) : [...card.labels, labelId],
    });
  };

  const toggleCardMember = (cardId: string, memberId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const exists = card.members.includes(memberId);
    updateCard(cardId, {
      members: exists ? card.members.filter((m) => m !== memberId) : [...card.members, memberId],
    });
  };

  const createLabel = (name: string, colorCode: string): Label => {
    const newLabel: Label = {
      id: 'lbl_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      colorCode,
      bgClass: 'bg-indigo-500/15',
      textClass: 'text-indigo-500 dark:text-indigo-400',
    };
    if (activeBoard) {
      updateBoard(activeBoard.id, {
        labels: [...activeBoard.labels, newLabel],
      });
    }
    return newLabel;
  };

  const exportData = (): string => {
    return JSON.stringify({ boards, cards }, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.boards && Array.isArray(parsed.boards)) setBoards(parsed.boards);
      if (parsed.cards && Array.isArray(parsed.cards)) setCards(parsed.cards);
      return true;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.BOARDS);
    localStorage.removeItem(STORAGE_KEYS.CARDS);
    setBoards(INITIAL_BOARDS);
    setCards(INITIAL_CARDS);
    setActiveBoardId('xwb53k51huwr');
  };
  const useTemplate = async (templateId: string): Promise<string> => {
    const tmpl = INITIAL_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return activeBoardId;

    if (isSupabaseConfigured && currentUser) {
      // 1. Create project
      const { data: newProj, error: projErr } = await supabase
        .from('projects')
        .insert({
          title: tmpl.name,
          description: tmpl.description,
          visibility: 'private',
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (projErr || !newProj) {
        console.error('Failed to create template board in Supabase:', projErr);
        throw projErr;
      }

      // 2. Remove default starter lists created by trigger if any
      await supabase.from('lists').delete().eq('project_id', newProj.id);

      // 3. Insert template's specific custom columns
      const listInserts = tmpl.lists.map((name, idx) => ({
        project_id: newProj.id,
        name,
        position: idx,
      }));

      const { data: createdLists } = await supabase
        .from('lists')
        .insert(listInserts)
        .select();

      // 4. Insert template's starter cards into corresponding columns
      if (createdLists && createdLists.length > 0 && tmpl.sampleCards.length > 0) {
        const sortedLists = [...createdLists].sort((a, b) => (a.position || 0) - (b.position || 0));
        const cardInserts = tmpl.sampleCards.map((sc, idx) => {
          const targetList = sortedLists[sc.listIndex] || sortedLists[0];
          return {
            project_id: newProj.id,
            list_id: targetList.id,
            title: sc.title,
            description: sc.description || '',
            position: idx,
            labels: sc.labels,
            created_by: currentUser.id,
          };
        });

        await supabase.from('cards').insert(cardInserts);
      }

      await refreshFromCloud();
      setActiveBoardIdState(newProj.id);
      setActivePage('board');
      return newProj.id;
    }

    // Local fallback mode
    const newBoardId = 'brd_' + Math.random().toString(36).substring(2, 9);
    const newLists = tmpl.lists.map((name, idx) => ({
      id: `lst_${newBoardId}_${idx}`,
      boardId: newBoardId,
      name,
      position: idx,
    }));

    const newBoard: Board = {
      id: newBoardId,
      title: tmpl.name,
      slug: tmpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      workspaceId: workspace.id,
      visibility: 'private',
      isStarred: false,
      createdAt: new Date().toISOString(),
      description: tmpl.description,
      labels: INITIAL_LABELS,
      lists: newLists,
    };

    const newCards: Card[] = tmpl.sampleCards.map((sc, idx) => {
      const targetList = newLists[sc.listIndex] || newLists[0];
      return {
        id: `crd_${newBoardId}_${idx}`,
        boardId: newBoardId,
        listId: targetList.id,
        title: sc.title,
        description: sc.description || '',
        position: idx,
        labels: sc.labels,
        members: [],
        dueDate: null,
        checklists: [],
        comments: [],
        attachments: [],
        activity: [],
        createdAt: new Date().toISOString(),
      };
    });

    setBoards((prev) => [newBoard, ...prev]);
    setCards((prev) => [...prev, ...newCards]);
    setActiveBoardIdState(newBoardId);
    setActivePage('board');
    return newBoardId;
  };

  return (
    <BoardContext.Provider
      value={{
        currentUser,
        boards,
        cards,
        workspace,
        members,
        labels,
        activeBoardId,
        activeBoard,
        activePage,
        viewMode,
        searchQuery,
        selectedLabelFilter,
        selectedMemberFilter,
        isSidebarCollapsed,
        theme,
        selectedCardId,
        selectedCard,
        activeModal,
        modalData,
        isCloudConnected: isSupabaseConfigured && Boolean(currentUser),

        setActivePage,
        setActiveBoardId,
        setViewMode,
        setSearchQuery,
        setSelectedLabelFilter,
        setSelectedMemberFilter,
        setIsSidebarCollapsed,
        setTheme,
        toggleTheme,
        openCardModal,
        closeCardModal,
        openModal,
        closeModal,
        signOut,

        createBoard,
        updateBoard,
        deleteBoard,
        toggleStarBoard,
        createInviteLink,

        createList,
        updateList,
        deleteList,
        reorderLists,

        createCard,
        updateCard,
        deleteCard,
        duplicateCard,
        moveCard,

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
        exportData,
        importData,
        resetAllData,

        useTemplate,
        refreshFromCloud,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
