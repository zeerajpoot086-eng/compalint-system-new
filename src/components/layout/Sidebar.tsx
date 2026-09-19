import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  Wrench,
  BarChart3,
  ShieldCheck,
  UserCheck,
  LifeBuoy,
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenNewComplaint?: () => void;
  stats?: {
    total?: number;
    pending?: number;
    urgent?: number;
    inProgress?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onOpenNewComplaint, stats }) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200/80 bg-white/70 backdrop-blur-sm p-4 dark:border-slate-800 dark:bg-slate-900/70 shrink-0">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white object-cover dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">{user.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block h-2 w-2 rounded-full ${
                user.role === 'admin' ? 'bg-indigo-500' : user.role === 'technician' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button for Users */}
        {user.role === 'user' && onOpenNewComplaint && (
          <button
            onClick={onOpenNewComplaint}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            File New Complaint
          </button>
        )}

        {/* Navigation Sections */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>

          {user.role === 'user' && (
            <>
              <button
                onClick={() => setCurrentView('user-dashboard')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  currentView === 'user-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                  <span>My Complaints</span>
                </div>
                {stats?.pending !== undefined && stats.pending > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {stats.pending}
                  </span>
                )}
              </button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  currentView === 'admin-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  <span>Admin Overview</span>
                </div>
              </button>
            </>
          )}

          {user.role === 'technician' && (
            <>
              <button
                onClick={() => setCurrentView('technician-dashboard')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  currentView === 'technician-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="h-4 w-4 text-amber-500" />
                  <span>Assigned Tasks</span>
                </div>
                {stats?.inProgress !== undefined && stats.inProgress > 0 && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {stats.inProgress}
                  </span>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentView('profile')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              currentView === 'profile'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* AI Highlight Banner in Sidebar */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 to-purple-50/50 p-3.5 text-xs dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-purple-950/20">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>AI Triage Active</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            Issues are automatically classified with priority and hazard diagnosis.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>FixMate Engine</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono dark:bg-slate-800">v1.0</span>
        </div>
      </div>
    </aside>
  );
};
