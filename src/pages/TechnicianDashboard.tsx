import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types';
import { ComplaintDetailsModal } from '../components/complaints/ComplaintDetailsModal';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Phone,
  RotateCw,
  PlusCircle,
  FileCheck,
  Loader2,
  X,
  Send,
  AlertTriangle
} from 'lucide-react';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [techProfile, setTechProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    inProgress: 0,
    pendingAction: 0,
    completed: 0,
    rating: 4.9,
    totalResolvedOverall: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Work Log Modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<Complaint | null>(null);
  const [workNote, setWorkNote] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [isSavingLog, setIsSavingLog] = useState(false);

  // Complete Job Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchTechData = async () => {
    setIsLoading(true);
    try {
      const res = await api.technician.getAssignedComplaints();
      if (res.success) {
        setComplaints(res.complaints);
        setTechProfile(res.technicianProfile);
        setStats(res.stats);
      }
    } catch (err: any) {
      showToast('Error loading technician assignments: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechData();
  }, []);

  const handleStartWork = async (complaintId: string, ticketNum: string) => {
    try {
      await api.technician.updateComplaint(complaintId, {
        status: 'In Progress',
        workNote: 'Technician arrived on-site and commenced diagnostics.'
      });
      showToast(`Job ${ticketNum} marked as In Progress!`, 'success');
      fetchTechData();
    } catch (err: any) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleSaveWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob || !workNote.trim()) return;

    setIsSavingLog(true);
    try {
      await api.technician.updateComplaint(activeJob._id || activeJob.id, {
        workNote: workNote.trim(),
        partsUsed: partsUsed.trim() || undefined
      });
      showToast('Work note logged successfully!', 'success');
      setLogModalOpen(false);
      setWorkNote('');
      setPartsUsed('');
      setActiveJob(null);
      fetchTechData();
    } catch (err: any) {
      showToast('Failed to save log: ' + err.message, 'error');
    } finally {
      setIsSavingLog(false);
    }
  };

  const handleCompleteJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob || !resolutionSummary.trim()) return;

    setIsCompleting(true);
    try {
      await api.technician.updateComplaint(activeJob._id || activeJob.id, {
        status: 'Completed',
        resolutionSummary: resolutionSummary.trim()
      });
      showToast(`Job ${activeJob.complaintId} marked Completed! Resolution logged.`, 'success');
      setCompleteModalOpen(false);
      setResolutionSummary('');
      setActiveJob(null);
      fetchTechData();
    } catch (err: any) {
      showToast('Failed to complete job: ' + err.message, 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Field Technician Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage assigned on-site repairs, log work inspection notes, and sign off completed tasks.
          </p>
        </div>

        <button
          onClick={fetchTechData}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Tasks</span>
        </button>
      </div>

      {/* Technician Profile Card + Quick Metrics */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Technician')}`}
              alt={user?.name}
              className="h-14 w-14 rounded-2xl border-2 border-amber-500 bg-slate-50 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active On-Duty
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specialization: <strong className="text-indigo-600 dark:text-indigo-400">{techProfile?.specialization || 'Technical Specialist'}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-[10px] text-slate-400">Rating</div>
              <div className="text-base font-bold text-amber-500 flex items-center justify-center gap-0.5">
                <Award className="h-3.5 w-3.5" />
                {stats.rating}★
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-[10px] text-slate-400">Assigned</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">{stats.totalAssigned}</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-[10px] text-slate-400">Active Work</div>
              <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{stats.inProgress}</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-[10px] text-slate-400">Resolved</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-500" />
          <span>My Assigned Service Queue ({complaints.length})</span>
        </h3>

        {complaints.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No pending jobs assigned to your queue at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {complaints.map(c => (
              <div
                key={c._id || c.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all space-y-4"
              >
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                      {c.complaintId}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {c.category}
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      c.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {c.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Status:</span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Problem Description & Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  <div className="md:col-span-2 space-y-2">
                    <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl dark:bg-slate-800/40">
                      {c.description}
                    </div>

                    {c.aiAnalysis && (
                      <div className="flex items-start gap-2 rounded-xl bg-indigo-50/70 p-3 text-[11px] text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                        <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>AI Diagnosis: </strong> {c.aiAnalysis.problemSummary}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Meta */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1.5 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="font-bold text-slate-900 dark:text-white">{c.userName}</div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{c.userPhone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      <span className="truncate">{c.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      <span>Preferred: {c.preferredDate}</span>
                    </div>
                  </div>

                </div>

                {/* Technician Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedComplaint(c);
                      setIsDetailsOpen(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    View Full Ticket & History →
                  </button>

                  <div className="flex items-center gap-2">
                    {c.status === 'Assigned' && (
                      <button
                        onClick={() => handleStartWork(c._id || c.id, c.complaintId)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                      >
                        Start Work
                      </button>
                    )}

                    {c.status === 'In Progress' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveJob(c);
                            setLogModalOpen(true);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          + Log Note / Parts
                        </button>
                        <button
                          onClick={() => {
                            setActiveJob(c);
                            setCompleteModalOpen(true);
                          }}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
                        >
                          Mark as Completed
                        </button>
                      </>
                    )}

                    {c.status === 'Completed' && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Work Log Modal */}
      {logModalOpen && activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Append Work Log for Ticket {activeJob.complaintId}
              </h3>
              <button onClick={() => setLogModalOpen(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkLog} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Observation / Work Note *</label>
                <textarea
                  rows={3}
                  required
                  value={workNote}
                  onChange={e => setWorkNote(e.target.value)}
                  placeholder="e.g. Cleared blocked drainage line using mechanical auger. Tested water flow."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Parts Replaced / Installed (Optional)</label>
                <input
                  type="text"
                  value={partsUsed}
                  onChange={e => setPartsUsed(e.target.value)}
                  placeholder="e.g. 2x PVC Coupling, Silicone Sealant"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLog}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  {isSavingLog ? 'Saving...' : 'Save Work Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Complete Job Modal */}
      {completeModalOpen && activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Finalize & Sign-off Ticket {activeJob.complaintId}
              </h3>
              <button onClick={() => setCompleteModalOpen(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteJob} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Resolution Sign-Off Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionSummary}
                  onChange={e => setResolutionSummary(e.target.value)}
                  placeholder="e.g. Issue completely resolved. Unit cooling restored to normal operating temperature. Customer verified functional operation."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompleting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
                >
                  {isCompleting ? 'Finalizing...' : 'Sign Off & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={fetchTechData}
      />

    </div>
  );
};
