import React, { useState, useEffect } from 'react';
import { UserCheck, AlertCircle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useBoard } from '../context/BoardContext';

interface JoinProjectModalProps {
  inviteToken: string | null;
  onJoined: (projectId: string) => void;
  onClose: () => void;
}

export const JoinProjectModal: React.FC<JoinProjectModalProps> = ({
  inviteToken,
  onJoined,
  onClose,
}) => {
  const { currentUser, openModal } = useBoard();
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!inviteToken || !isSupabaseConfigured) return;

    const fetchInviteDetails = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // Fetch invite details
        const { data: invite, error: inviteErr } = await supabase
          .from('project_invites')
          .select('project_id, role, projects(title)')
          .eq('token', inviteToken)
          .single();

        if (inviteErr || !invite) {
          throw new Error('This invitation link is invalid or has expired.');
        }

        const title = (invite as any).projects?.title || 'Project Board';
        setProjectTitle(title);
        setProjectId(invite.project_id);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to verify invitation.');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [inviteToken]);

  const handleAcceptInvite = async () => {
    if (!currentUser) {
      openModal('auth');
      return;
    }

    if (!projectId) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      // Add user to project_members
      const { error: memberErr } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: currentUser.id,
          role: 'member',
        });

      if (memberErr && !memberErr.message.includes('unique')) {
        throw memberErr;
      }

      setSuccess(true);
      setTimeout(() => {
        onJoined(projectId);
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not join project.');
    } finally {
      setLoading(false);
    }
  };

  if (!inviteToken) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3">
          <UserCheck className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 dark:text-dark-1000 mb-1">
          Join Project
        </h3>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-light-800 dark:text-dark-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying invitation link...</span>
          </div>
        ) : errorMsg ? (
          <div className="py-4">
            <div className="flex items-center justify-center gap-2 text-xs text-red-500 mb-4">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-light-200 dark:bg-dark-300 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-dark-950"
            >
              Dismiss
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-light-800 dark:text-dark-800 mb-2">
              You've been invited to collaborate on:
            </p>
            <p className="text-sm font-bold text-neutral-900 dark:text-dark-1000 bg-light-100 dark:bg-dark-200 py-2 px-3 rounded-lg border border-light-300 dark:border-dark-400 mb-4">
              {projectTitle}
            </p>

            <p className="text-[11px] text-light-800 dark:text-dark-800 mb-5">
              You will only have access to this specific board. You will not see any other projects of the owner, and you can create your own private projects.
            </p>

            {success ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-500 font-semibold py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Joined! Loading your board...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-light-800 dark:text-dark-800 hover:bg-light-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptInvite}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
                >
                  <span>{currentUser ? 'Accept & Join Board' : 'Sign in to Join'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinProjectModal;
