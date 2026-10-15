import { Board, Card, Member, Workspace, Template, Label } from '../types';

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws_default',
  name: 'My Workspace',
  slug: 'workspace',
  icon: '⚡',
  members: [],
};

export const INITIAL_LABELS: Label[] = [
  { id: 'lbl_bug', name: 'Bug', colorCode: '#ef4444', bgClass: 'bg-red-500/15', textClass: 'text-red-500 dark:text-red-400' },
  { id: 'lbl_feat', name: 'Feature', colorCode: '#3b82f6', bgClass: 'bg-blue-500/15', textClass: 'text-blue-500 dark:text-blue-400' },
  { id: 'lbl_ui', name: 'Design / UI', colorCode: '#8b5cf6', bgClass: 'bg-purple-500/15', textClass: 'text-purple-500 dark:text-purple-400' },
  { id: 'lbl_infra', name: 'Infra / DevOps', colorCode: '#f59e0b', bgClass: 'bg-amber-500/15', textClass: 'text-amber-500 dark:text-amber-400' },
  { id: 'lbl_perf', name: 'Performance', colorCode: '#10b981', bgClass: 'bg-emerald-500/15', textClass: 'text-emerald-500 dark:text-emerald-400' },
  { id: 'lbl_high', name: 'High Priority', colorCode: '#ec4899', bgClass: 'bg-pink-500/15', textClass: 'text-pink-500 dark:text-pink-400' },
];

export const INITIAL_BOARDS: Board[] = [
  {
    id: 'xwb53k51huwr',
    title: 'Main Project',
    slug: 'main-project',
    workspaceId: 'ws_default',
    visibility: 'private',
    isStarred: true,
    createdAt: new Date().toISOString(),
    description: 'Clean project board with multi-column task tracking.',
    labels: INITIAL_LABELS,
    lists: [
      { id: 'lst_todo', boardId: 'xwb53k51huwr', name: 'To Do', position: 0 },
      { id: 'lst_inprogress', boardId: 'xwb53k51huwr', name: 'In Progress', position: 1 },
      { id: 'lst_done', boardId: 'xwb53k51huwr', name: 'Done', position: 2 },
    ],
  },
];

export const INITIAL_CARDS: Card[] = [
  {
    id: 'crd_01',
    boardId: 'xwb53k51huwr',
    listId: 'lst_todo',
    title: 'Welcome to your clean project board',
    description: 'This is a clean task card. You can click here to edit the title, description, checklists, and due dates.\n\nInvite team members to this project using the Share button in the top header.',
    position: 0,
    labels: ['lbl_feat'],
    members: [],
    dueDate: null,
    checklists: [
      {
        id: 'chk_1',
        title: 'Getting Started',
        items: [
          { id: 'item_1', text: 'Create your first custom task', completed: false },
          { id: 'item_2', text: 'Invite a collaborator via link', completed: false },
        ],
      },
    ],
    comments: [],
    attachments: [],
    activity: [],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tmpl_scrum',
    name: 'Agile Sprint Board',
    description: 'Classic Scrum sprint workflow with Backlog, Sprint To Do, In Progress, Review, and Done.',
    category: 'Engineering',
    lists: ['Backlog', 'Sprint Backlog', 'In Development', 'Testing / Review', 'Done'],
    sampleCards: [],
  },
  {
    id: 'tmpl_bug',
    name: 'Bug Tracker & Triage',
    description: 'Track reported bugs from incoming issues to triage, fixing, verification, and closure.',
    category: 'Engineering',
    lists: ['Reported', 'Triaged', 'In Progress', 'Ready to Verify', 'Resolved'],
    sampleCards: [],
  },
  {
    id: 'tmpl_product',
    name: 'Product Roadmap & Discovery',
    description: 'Organize features by planning horizons: Research, Q1 Commitments, Q2 Horizon, and Shipped.',
    category: 'Product',
    lists: ['Discovery & Research', 'Up Next', 'In Execution', 'Beta Testing', 'Launched'],
    sampleCards: [],
  },
  {
    id: 'tmpl_personal',
    name: 'Personal Productivity Board',
    description: 'Simple, effective GTD (Getting Things Done) board for personal tasks and weekly focus.',
    category: 'Personal',
    lists: ['Inbox / Capture', 'This Week', 'Today', 'Waiting On', 'Completed'],
    sampleCards: [],
  },
];
