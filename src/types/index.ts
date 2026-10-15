export type Visibility = 'public' | 'workspace' | 'private';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface Label {
  id: string;
  name: string;
  colorCode: string; // hex
  bgClass: string;
  textClass: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Card {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  description: string;
  position: number;
  labels: string[]; // label IDs
  members: string[]; // member IDs
  dueDate: string | null;
  startDate?: string | null;
  completed?: boolean;
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
  activity: Activity[];
  createdAt: string;
  coverImage?: string;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  slug: string;
  workspaceId: string;
  visibility: Visibility;
  isStarred: boolean;
  lists: List[];
  labels: Label[];
  createdAt: string;
  description?: string;
  createdBy?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon: string;
  members: Member[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  lists: string[];
  sampleCards: {
    title: string;
    listIndex: number;
    labels: string[];
    description?: string;
  }[];
}
