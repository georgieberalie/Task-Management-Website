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
    description: 'Sprint planning workflow with Backlog, Sprint Backlog, In Development, QA & Testing, and Released.',
    category: 'Engineering',
    lists: ['Backlog', 'Sprint Backlog', 'In Development', 'Testing / Review', 'Done'],
    sampleCards: [
      {
        title: 'User registration with email & password',
        listIndex: 1,
        labels: ['lbl_feat'],
        description: 'Implement secure account registration with password hashing and session tokens.',
      },
      {
        title: 'Optimize card drag and drop performance',
        listIndex: 2,
        labels: ['lbl_perf'],
        description: 'Profile React re-renders during rapid drag sweeps across multiple columns.',
      },
      {
        title: 'Write automated unit tests for invite links',
        listIndex: 3,
        labels: ['lbl_infra'],
        description: 'Ensure token verification correctly adds member to project_members table.',
      },
      {
        title: 'Project architecture setup and Tailwind configuration',
        listIndex: 4,
        labels: ['lbl_infra'],
        description: 'Scaffold Vite project and set up responsive layout with dot grid canvas.',
      },
    ],
  },
  {
    id: 'tmpl_bug',
    name: 'Bug Tracker & Triage',
    description: 'Track reported bugs from incoming issues to triage, fixing, verification, and closure.',
    category: 'Engineering',
    lists: ['Reported', 'Triaged', 'In Progress', 'Ready to Verify', 'Resolved'],
    sampleCards: [
      {
        title: 'Modal does not dismiss on mobile swipe',
        listIndex: 0,
        labels: ['lbl_bug'],
        description: 'Check touch event handlers on iOS Safari when tapping outside the dialog.',
      },
      {
        title: 'Investigate token expiration handling',
        listIndex: 1,
        labels: ['lbl_bug', 'lbl_high'],
        description: 'Provide a clean redirect to login when a user session expires.',
      },
      {
        title: 'Patch CORS header configuration',
        listIndex: 4,
        labels: ['lbl_infra'],
        description: 'Verified on production staging environment.',
      },
    ],
  },
  {
    id: 'tmpl_product',
    name: 'Product Roadmap & Discovery',
    description: 'Organize features by planning horizons: Research, Up Next, In Execution, Beta Testing, and Launched.',
    category: 'Product',
    lists: ['Discovery & Research', 'Up Next', 'In Execution', 'Beta Testing', 'Launched'],
    sampleCards: [
      {
        title: 'Conduct user interviews on team sharing',
        listIndex: 0,
        labels: ['lbl_ui'],
        description: 'Gather feedback on how users prefer to invite colleagues to isolated boards.',
      },
      {
        title: 'Real-time WebSocket card updates',
        listIndex: 2,
        labels: ['lbl_feat', 'lbl_high'],
        description: 'Broadcast card position changes to all connected viewers in real time.',
      },
      {
        title: 'Cloud database schema with Row Level Security',
        listIndex: 4,
        labels: ['lbl_infra'],
        description: 'Completed and running on Supabase PostgreSQL.',
      },
    ],
  },
  {
    id: 'tmpl_personal',
    name: 'Personal Productivity Board',
    description: 'Effective GTD (Getting Things Done) board for personal tasks and weekly focus.',
    category: 'Personal',
    lists: ['Inbox / Capture', 'This Week', 'Today', 'Waiting On', 'Completed'],
    sampleCards: [
      {
        title: 'Review weekly priorities and schedule focus blocks',
        listIndex: 1,
        labels: ['lbl_high'],
        description: 'Select the 3 most impactful tasks for the upcoming week.',
      },
      {
        title: 'Publish ToDo website to Vercel',
        listIndex: 2,
        labels: ['lbl_feat'],
        description: 'Connect GitHub repository and configure Supabase environment variables.',
      },
      {
        title: 'Set up Supabase project and run database schema',
        listIndex: 4,
        labels: ['lbl_infra'],
        description: 'Database tables and Row-Level Security policies active.',
      },
    ],
  },
];
