import React, { useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
  AlertTriangle,
  FileCode,
} from 'lucide-react';
import { useBoard } from '../../context/BoardContext';

export const SettingsView: React.FC = () => {
  const {
    workspace,
    theme,
    setTheme,
    exportData,
    importData,
    resetAllData,
  } = useBoard();

  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-backup-${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;

    const success = importData(importJson);
    if (success) {
      setImportStatus('success');
      setTimeout(() => setImportStatus(null), 3000);
      setImportJson('');
    } else {
      setImportStatus('error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importData(content);
          if (success) {
            setImportStatus('success');
            setTimeout(() => setImportStatus(null), 3000);
          } else {
            setImportStatus('error');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-3.5rem)] md:h-screen p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-1000">
            Settings
          </h1>
          <p className="text-xs text-light-800 dark:text-dark-800 mt-1">
            Manage your workspace preferences, interface theme, and board backups.
          </p>
        </div>

        {/* Theme Settings */}
        <div className="rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/60 p-6 shadow-xs backdrop-blur-md">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000 mb-1">
            Appearance
          </h3>
          <p className="text-xs text-light-800 dark:text-dark-800 mb-4">
            Customize how ToDo looks on your device.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                  : 'border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 text-neutral-800 dark:text-dark-950 hover:bg-light-200'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark Theme</span>
              {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-indigo-500" />}
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                  : 'border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 text-neutral-800 dark:text-dark-950 hover:bg-light-200'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light Theme</span>
              {theme === 'light' && <Check className="ml-auto h-4 w-4 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* Data Backup & Export / Import */}
        <div className="rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/60 p-6 shadow-xs backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000 mb-1">
              Data Backup & Portability
            </h3>
            <p className="text-xs text-light-800 dark:text-dark-800">
              Export your boards and tasks into standard JSON or import an existing backup.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4" />
              <span>Export All Boards (.JSON)</span>
            </button>

            <label className="flex items-center gap-2 rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-dark-950 hover:bg-light-200 dark:hover:bg-dark-400 cursor-pointer transition-colors shadow-2xs">
              <Upload className="h-4 w-4" />
              <span>Upload Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Paste JSON Import */}
          <form onSubmit={handleImport} className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-neutral-800 dark:text-dark-950 block">
              Or Paste Backup JSON Content
            </label>
            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste raw JSON here..."
              className="w-full rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 p-2.5 text-xs font-mono text-neutral-900 dark:text-dark-1000 outline-none"
            />
            <div className="flex items-center justify-between">
              {importStatus === 'success' && (
                <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Data restored successfully!
                </span>
              )}
              {importStatus === 'error' && (
                <span className="text-xs font-medium text-red-500">
                  Invalid JSON format. Please verify the backup file.
                </span>
              )}
              <button
                type="submit"
                disabled={!importJson.trim()}
                className="ml-auto rounded-lg bg-neutral-900 dark:bg-dark-1000 dark:text-dark-50 text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90 disabled:opacity-40"
              >
                Restore JSON
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone: Reset Data */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="text-sm font-bold">Reset Demo Workspace</h3>
              </div>
              <p className="text-xs text-light-800 dark:text-dark-800">
                Reset your boards and tasks back to the original demo board from task.isotoxal.studio.
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all boards and cards to initial demo data?')) {
                  resetAllData();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
