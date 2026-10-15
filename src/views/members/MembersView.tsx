import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Check } from 'lucide-react';
import { useBoard } from '../../context/BoardContext';
import { Member } from '../../types';

export const MembersView: React.FC = () => {
  const { workspace, members } = useBoard();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      setInviteSuccess(true);
      setTimeout(() => {
        setInviteSuccess(false);
        setInviteEmail('');
        setInviteModalOpen(false);
      }, 1200);
    }
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col h-[calc(100vh-3.5rem)] md:h-screen p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-1000">
              Workspace Members
            </h1>
            <p className="text-xs text-light-800 dark:text-dark-800 mt-1">
              Manage collaborators and assign permissions in {workspace.name}.
            </p>
          </div>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite member</span>
          </button>
        </div>

        {/* Members Roster Card */}
        <div className="rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50/90 dark:bg-dark-200/60 overflow-hidden shadow-xs backdrop-blur-md">
          <div className="divide-y divide-light-300/80 dark:divide-dark-400/80">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-light-100/50 dark:hover:bg-dark-300/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-light-300 dark:ring-dark-400"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-light-50 dark:ring-dark-100" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000">
                      {member.name}
                    </h3>
                    <p className="text-xs text-light-800 dark:text-dark-800">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-md border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-300 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-dark-950 capitalize">
                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{member.role}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-dark-1000 mb-1">
              Invite Team Member
            </h3>
            <p className="text-xs text-light-800 dark:text-dark-800 mb-4">
              Enter their email address to grant access to {workspace.name}.
            </p>

            {inviteSuccess ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="h-4 w-4" />
                <span>Invitation link sent successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-2">
                    <Mail className="h-4 w-4 text-light-800 dark:text-dark-800 mr-2" />
                    <input
                      type="email"
                      autoFocus
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@isotoxal.studio"
                      className="w-full bg-transparent text-xs text-neutral-900 dark:text-dark-1000 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-2 text-xs text-neutral-900 dark:text-dark-1000 outline-none"
                  >
                    <option value="admin">Admin (Full workspace control)</option>
                    <option value="member">Member (Can create, edit cards & boards)</option>
                    <option value="viewer">Viewer (Read-only access)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200 dark:hover:bg-dark-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersView;
