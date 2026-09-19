import React, { useState } from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';
import { PrintableComplaintReport } from './PrintableComplaintReport';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Printer,
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Star,
  MessageSquare,
  Wrench,
  Send,
  Loader2,
  Copy
} from 'lucide-react';

interface ComplaintDetailsModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'ai' | 'notes'>('overview');
  const [isPrinting, setIsPrinting] = useState(false);

  // Rating & feedback state
  const [rating, setRating] = useState<number>(complaint?.rating || 5);
  const [feedback, setFeedback] = useState<string>(complaint?.feedback || '');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Add work note state (for Tech/Admin)
  const [newNote, setNewNote] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!isOpen || !complaint) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(complaint.complaintId);
    showToast(`Copied ${complaint.complaintId} to clipboard!`, 'info');
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await api.complaints.update(complaint._id || complaint.id, {
        rating,
        feedback: feedback.trim()
      });
      showToast('Thank you for rating our service!', 'success');
      onUpdate();
    } catch (err: any) {
      showToast('Failed to save rating: ' + err.message, 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      if (user?.role === 'technician') {
        await api.technician.updateComplaint(complaint._id || complaint.id, {
          workNote: newNote.trim(),
          partsUsed: partsUsed.trim() || undefined
        });
      } else {
        await api.admin.updateComplaint(complaint._id || complaint.id, {
          adminNote: newNote.trim()
        });
      }

      showToast('Work note appended successfully!', 'success');
      setNewNote('');
      setPartsUsed('');
      onUpdate();
    } catch (err: any) {
      showToast('Failed to add note: ' + err.message, 'error');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800';
      case 'Assigned':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 font-bold border-rose-300 dark:bg-rose-950/80 dark:text-rose-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 font-semibold border-amber-300 dark:bg-amber-950/80 dark:text-amber-300';
      case 'Medium':
        return 'bg-sky-100 text-sky-800 font-medium border-sky-300 dark:bg-sky-950/80 dark:text-sky-300';
      case 'Low':
        return 'bg-slate-100 text-slate-700 font-medium border-slate-300 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto no-print">
        <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                  {complaint.complaintId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Copy ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(complaint.status)}`}>
                {complaint.status}
              </span>

              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${getPriorityBadge(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Print Service Report"
              >
                <Printer className="h-3.5 w-3.5 text-indigo-500" />
                <span>Print Report</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 dark:border-slate-800 text-xs font-semibold shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview & Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Timeline History ({complaint.timeline?.length || 0})
            </button>
            {complaint.aiAnalysis && (
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'ai'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                AI Smart Diagnosis
              </button>
            )}
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Work Logs & Notes ({complaint.workNotes?.length || 0})
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Description & Photo */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Description</h4>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200">
                    {complaint.description}
                  </div>

                  {complaint.imageUrl && (
                    <div className="mt-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Attached Photo</h4>
                      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 max-h-64">
                        <img src={complaint.imageUrl} alt="Complaint Attachment" className="w-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">Service & Request Info</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Wrench className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>Category: <strong className="text-slate-900 dark:text-white">{complaint.category}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>{complaint.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Preferred Date: {complaint.preferredDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-sky-500 shrink-0" />
                      <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Customer / Technician Info */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">Assigned Specialist</div>
                    {complaint.assignedTechnicianName ? (
                      <div className="space-y-1.5">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <User className="h-4 w-4 text-emerald-500" />
                          {complaint.assignedTechnicianName}
                        </div>
                        {complaint.assignedTechnicianPhone && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{complaint.assignedTechnicianPhone}</span>
                          </div>
                        )}
                        <span className="inline-block mt-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active Dispatch
                        </span>
                      </div>
                    ) : (
                      <div className="py-2 text-slate-400 italic">
                        No technician assigned yet. Smart router is matching available technicians.
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolution Summary (if completed) */}
                {complaint.resolutionSummary && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Resolution Sign-Off</span>
                    </div>
                    <p className="mt-1.5 leading-relaxed text-emerald-800 dark:text-emerald-200">
                      {complaint.resolutionSummary}
                    </p>
                  </div>
                )}

                {/* Customer Rating Box for Completed Tasks */}
                {complaint.status === 'Completed' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/30">
                    <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                      <span>Service Quality Rating & Feedback</span>
                    </div>

                    {complaint.rating ? (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                s <= (complaint.rating || 0)
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-bold text-slate-700 dark:text-slate-200">
                            {complaint.rating}/5 Stars
                          </span>
                        </div>
                        {complaint.feedback && (
                          <p className="text-slate-600 dark:text-slate-300 italic mt-1">
                            "{complaint.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleRatingSubmit} className="mt-3 space-y-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(starValue => (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => setRating(starValue)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  starValue <= rating
                                    ? 'text-amber-500 fill-amber-400'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          placeholder="How was the technician's service? (Optional)"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback}
                          className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-500"
                        >
                          Submit Rating
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: TIMELINE HISTORY */}
            {activeTab === 'timeline' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {complaint.timeline?.map((evt, idx) => (
                    <div key={evt.id || idx} className="relative group">
                      <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm ring-4 ring-white dark:ring-slate-900">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                          <span>{evt.title}</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {evt.description}
                        </p>
                        <div className="mt-2 text-[10px] text-slate-400">
                          Updated by: <strong className="text-slate-600 dark:text-slate-300">{evt.performedBy}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: AI DIAGNOSIS */}
            {activeTab === 'ai' && complaint.aiAnalysis && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 p-5 text-xs dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-purple-950/20 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      <span>FixMate Neural Diagnostic Summary</span>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {Math.round((complaint.aiAnalysis.confidenceScore || 0.96) * 100)}% Confidence
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/80 p-3.5 border border-indigo-100/80 dark:bg-slate-900/80 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Problem Diagnosis</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white text-xs">
                      {complaint.aiAnalysis.problemSummary}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/80 p-3.5 border border-indigo-100/80 dark:bg-slate-900/80 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Immediate Safety & Preparation Protocol</span>
                    </div>
                    <div className="mt-1 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      {complaint.aiAnalysis.suggestedNextStep}
                    </div>
                  </div>

                  {complaint.aiAnalysis.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {complaint.aiAnalysis.tags.map(tag => (
                        <span key={tag} className="rounded-md bg-indigo-100/60 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB 4: WORK LOGS & NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Notes List */}
                <div className="space-y-3">
                  {(!complaint.workNotes || complaint.workNotes.length === 0) ? (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      No technician work logs added yet.
                    </div>
                  ) : (
                    complaint.workNotes.map(n => (
                      <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {n.author} <span className="text-slate-400 font-normal">({n.role})</span>
                          </span>
                          <span className="text-slate-400">
                            {new Date(n.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {n.note}
                        </p>
                        {n.partsUsed && (
                          <div className="mt-2 rounded-lg bg-indigo-50/70 p-2 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                            Parts Replaced: {n.partsUsed}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form (Visible to Tech or Admin) */}
                {(user?.role === 'technician' || user?.role === 'admin') && (
                  <form onSubmit={handleAddNote} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Append Technician Work Log
                    </div>
                    <textarea
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="e.g. Completed initial voltage testing, replaced faulty 40A breaker switch..."
                      rows={2}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={partsUsed}
                      onChange={e => setPartsUsed(e.target.value)}
                      placeholder="Installed parts or materials (Optional, e.g. 40A MCB, PVC 2-inch elbow)"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isAddingNote || !newNote.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {isAddingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Add Log Entry
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Hidden container for print view */}
      {isPrinting && (
        <div className="hidden print:block">
          <PrintableComplaintReport complaint={complaint} />
        </div>
      )}
    </>
  );
};
