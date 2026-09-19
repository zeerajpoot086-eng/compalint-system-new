import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { Complaint, DashboardStats } from '../types';
import { ComplaintFilterBar } from '../components/complaints/ComplaintFilterBar';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { ComplaintDetailsModal } from '../components/complaints/ComplaintDetailsModal';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  LayoutGrid,
  List,
  Sparkles,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

interface UserDashboardProps {
  onOpenReportModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenReportModal }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected complaint for modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await api.complaints.getAll({
        search,
        category,
        status,
        priority,
        sortBy,
        sortOrder: 'desc',
        page,
        limit: 8
      });

      if (res.success) {
        setComplaints(res.complaints);
        setStats(res.stats);
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err: any) {
      showToast('Failed to load complaints: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, category, status, priority, sortBy, page]);

  const handleOpenDetails = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsDetailsOpen(true);
  };

  const handleDetailsUpdated = () => {
    fetchComplaints();
    if (selectedComplaint) {
      // Re-fetch current selected complaint
      api.complaints.getById(selectedComplaint._id || selectedComplaint.id).then(res => {
        if (res.success) setSelectedComplaint(res.complaint);
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Customer Service Dashboard
            </h1>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              Welcome, {user?.name.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track reported complaints, inspect AI diagnosis recommendations, and view technician progress logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchComplaints()}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            File New Complaint
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Requests</span>
            <Inbox className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">All-time filed</div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-xs dark:border-amber-950/60 dark:bg-amber-950/20 transition-colors">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span>Pending Dispatch</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">
            {stats.pending}
          </div>
          <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Awaiting tech match</div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/40 p-4 shadow-xs dark:border-sky-950/60 dark:bg-sky-950/20 transition-colors">
          <div className="flex items-center justify-between text-sky-700 dark:text-sky-400 text-xs font-semibold">
            <span>In Progress</span>
            <Sparkles className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-900 dark:text-sky-200">
            {stats.inProgress}
          </div>
          <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">Under technician work</div>
        </div>

        {/* Resolved */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-950/60 dark:bg-emerald-950/20 transition-colors">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">
            {stats.completed}
          </div>
          <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Signed off fixes</div>
        </div>

        {/* Urgent */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4 shadow-xs dark:border-rose-950/60 dark:bg-rose-950/20 transition-colors">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <span>Urgent Level</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900 dark:text-rose-200">
            {stats.urgent}
          </div>
          <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">Emergency triage</div>
        </div>

      </div>

      {/* Filter Bar */}
      <ComplaintFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* View Switcher Controls & Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-white font-bold">{complaints.length}</span> complaints
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg p-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-xs text-slate-400">Loading complaints from FixMate server...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No complaints found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search || category || status || priority
              ? 'Try adjusting your filters or search keywords to see matching complaints.'
              : 'You have not reported any issues yet. Click below to file your first complaint.'}
          </p>
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusCircle className="h-4 w-4" />
            File New Complaint
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map(c => (
            <ComplaintCard key={c._id || c.id} complaint={c} onSelect={handleOpenDetails} />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map(c => (
                  <tr
                    key={c._id || c.id}
                    onClick={() => handleOpenDetails(c)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.complaintId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {c.category}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {c.description}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[150px] truncate">
                      {c.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase">
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDetails(c);
                        }}
                        className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detailed Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={handleDetailsUpdated}
      />

    </div>
  );
};
