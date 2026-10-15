# ToDo — Project & Task Management Studio

A modern, fast, and feature-complete project management and task board web application.

![kan.bn Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

## 🚀 Live Demo & Running Locally

The application is already built and running locally at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Quick Start Commands
```bash
# Navigate to the project directory
cd d:\ICSD\tasks-web

# Run in Development mode (with Hot Module Replacement)
npm run dev

# Or run in Production Preview mode
npm run preview

# Build for production
npm run build
```

---

## ✨ Features Implemented

### 1. 📋 Visual Kanban Board (Board ID: `xwb53k51huwr`)
* **Interactive Drag-and-Drop:** Smooth HTML5 drag-and-drop to reorder tasks within a column or drag across columns (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`).
* **Column Management:** Rename columns inline, add new columns (+ Add another list), delete columns, and quick-add tasks directly from the column header or footer.
* **Dot Matrix Background:** Pixel-perfect SVG dot-grid canvas pattern (`#3e3e3e` dots with SVG radial math) identical to `task.isotoxal.studio`.
* **Quick Task Creation:** Inline textarea with `Enter` to submit and `Esc` to cancel.

### 2. 📝 Comprehensive Task Detail Modal
* **Title & Location:** Inline editable card title and breadcrumb showing the active list.
* **Markdown Description:** Markdown editor with formatting toolbar (Bold, Italic, Lists, Code blocks) and live preview toggle.
* **Multi-Checklists:** Create multiple named checklists per card, track completion percentage, check/uncheck items, and trigger confetti celebrations on 100% completion!
* **Labels & Color Picker:** Custom tags with pastel background pill badges and custom hex color picker.
* **Due Dates & Status:** Due date badge with intelligent warning states:
  * 🔴 Overdue (red alert badge)
  * 🟡 Due soon (amber warning badge)
  * 🟢 Completed (green badge)
* **Attachments:** Attach file links and documents with thumbnail icons.
* **Comments & Audit Trail:** Interactive comments feed with team avatars, timestamps, and automatic card activity log.
* **Card Actions:** Duplicate card, move to another list, or delete with safety confirmation.

### 3. 🔄 Multiple Board Views
* **Kanban Board View:** The signature column-based flow.
* **Calendar View:** Monthly visual grid plotting cards on their due dates. Click any date to add a card!
* **Table View:** Spreadsheet-style tabular view with sortable columns (by Title, Status/List, Due Date).

### 4. 🔍 Filter & Search Bar
* Real-time search across task titles and descriptions.
* Filter cards by label (Bug, Feature, Design, DevOps, Performance, High Priority).
* Filter cards by assigned team member.
* Quick clear button and active filter counter badge.

### 5. 🧭 Sidebar Navigation & Workspaces
* **Brand:** Minimalist `kan.bn studio` header with collapsible sidebar toggle.
* **Workspace Switcher:** Switch between workspaces or create new ones (pre-configured with `Isotoxal Studio`).
* **Navigation Links:**
  * Boards (`G B`)
  * Templates (`G T`)
  * Members (`G M`)
  * Settings (`G S`)
* **Starred Boards:** Quick access to favorited boards with gold star toggle.
* **User Profile & Theme:** User card with avatar, online indicator, and quick Dark/Light theme toggle.

### 6. ⚡ Keyboard Shortcuts & Command Palette
* `Ctrl + K` / `Cmd + K`: Global Command Palette to search boards, cards, and jump across views.
* `?`: Interactive keyboard shortcuts dialog.
* `G` then `B`: Navigate to Boards.
* `G` then `T`: Navigate to Templates.
* `G` then `M`: Navigate to Members.
* `G` then `S`: Navigate to Settings.
* `Esc`: Close any active modal.

### 7. 📚 Pre-Made Templates Gallery
* Jumpstart new projects with 1-click templates:
  * **Agile Sprint Board** (Backlog, Sprint Backlog, In Development, Testing, Done)
  * **Bug Tracker & Triage** (Reported, Triaged, In Progress, Ready to Verify, Resolved)
  * **Product Roadmap & Discovery** (Discovery, Up Next, In Execution, Beta Testing, Launched)
  * **Personal Productivity Kanban** (Inbox, This Week, Today, Waiting On, Completed)

### 8. 👥 Team Members Roster
* View team members, roles (`Admin`, `Member`, `Viewer`), email addresses, and send invitations.

### 9. 💾 Local-First Persistence & Data Portability
* All boards, cards, checklists, and preferences persist in `localStorage`.
* **Export JSON:** 1-click export of full workspace data or individual board JSON.
* **Import JSON:** Restore backups by pasting raw JSON or uploading a `.json` file.
* **Reset Data:** Reset button to reload the original `xwb53k51huwr` demo board at any time.

---

## 🛠️ Tech Stack
* **Framework:** React 19 + TypeScript + Vite 8
* **Styling:** Tailwind CSS v4 + Plus Jakarta Sans typography
* **Icons:** Lucide React
* **Effects:** Canvas Confetti
* **Architecture:** Modular components with React Context API and local-first storage
