import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { AIAnalysis, ComplaintCategory, ComplaintPriority } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Wifi,
  Laptop,
  Hammer,
  HelpCircle,
  Calendar,
  MapPin,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Printer
} from 'lucide-react';

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: { label: ComplaintCategory; icon: any; color: string }[] = [
  { label: 'Electrician', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
  { label: 'Plumber', icon: Droplets, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
  { label: 'AC Repair', icon: Wind, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50' },
  { label: 'Internet/WiFi', icon: Wifi, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
  { label: 'Computer/Laptop', icon: Laptop, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
  { label: 'Appliance Repair', icon: Hammer, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
  { label: 'Other', icon: HelpCircle, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' }
];

export const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useNotification();

  const [category, setCategory] = useState<ComplaintCategory>('Electrician');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle AI analysis on description
  const handleAIAnalyze = async () => {
    if (!description.trim() || description.trim().length < 5) {
      showToast('Please type at least 5 characters describing the issue first.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.ai.analyze(description);
      if (res.success && res.analysis) {
        setAiResult(res.analysis);
        
        // Auto-apply suggested values
        if (res.analysis.suggestedCategory) {
          setCategory(res.analysis.suggestedCategory);
        }
        if (res.analysis.suggestedPriority) {
          setPriority(res.analysis.suggestedPriority);
        }

        showToast('AI Smart Analysis complete! Category & priority adjusted.', 'success');
      }
    } catch (err: any) {
      showToast('AI analysis error: ' + err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim() || !location.trim() || !preferredDate) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.complaints.create({
        category,
        description: description.trim(),
        location: location.trim(),
        preferredDate,
        imageUrl: imagePreview,
        priority,
        aiAnalysis: aiResult || undefined
      });

      if (res.success) {
        setCreatedTicketId(res.complaintId);
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        showToast(`Complaint registered! Ticket ID: ${res.complaintId}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit complaint', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (createdTicketId) {
      navigator.clipboard.writeText(createdTicketId);
      showToast('Complaint ID copied to clipboard!', 'info');
    }
  };

  const handleCloseAndReset = () => {
    setDescription('');
    setLocation('');
    setImagePreview('');
    setAiResult(null);
    setCreatedTicketId(null);
    onClose();
    if (createdTicketId) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        
        {/* Close Button */}
        <button
          onClick={handleCloseAndReset}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Confirmation Modal State */}
        {createdTicketId ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Complaint Successfully Registered!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Your service request has been queued in FixMate. Our smart dispatcher will assign the nearest qualified technician shortly.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Your Complaint Reference ID
              </div>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  {createdTicketId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  title="Copy ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Creation Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Report a Problem
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Describe the issue and our AI engine will automatically diagnose category, priority, and safety recommendations.
              </p>
            </div>

            {/* Problem Description with AI Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Problem Description <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIAnalyze}
                  disabled={isAnalyzing || !description.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing Issue...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      AI Smart Diagnose
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Living room AC is blowing warm air and showing error code E4 on digital display with a slight buzzing sound..."
                rows={3}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-900 transition-all"
              />
            </div>

            {/* AI Diagnosis Result Box (If analyzed) */}
            {aiResult && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>FixMate AI Diagnosis Summary</span>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Confidence: {Math.round((aiResult.confidenceScore || 0.95) * 100)}%
                  </span>
                </div>
                
                <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {aiResult.problemSummary}
                </div>

                <div className="mt-2 flex items-start gap-2 rounded-xl bg-white/80 p-2.5 text-[11px] text-slate-600 dark:bg-slate-900/80 dark:text-slate-400 border border-indigo-100/60 dark:border-slate-800">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Recommended Action: </span>
                    {aiResult.suggestedNextStep}
                  </div>
                </div>
              </div>
            )}

            {/* Category Selector Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition-all border text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${cat.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Preferred Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Service Location / Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Apt 4B, 742 Evergreen Terrace"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Preferred Visit Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Priority Selector & Image Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              
              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map(p => {
                    const isSelected = priority === p;
                    let style = 'text-slate-600 border-slate-200 dark:border-slate-700';
                    if (isSelected) {
                      if (p === 'Low') style = 'bg-slate-100 border-slate-400 text-slate-900 font-bold dark:bg-slate-800 dark:text-white';
                      if (p === 'Medium') style = 'bg-sky-50 border-sky-400 text-sky-700 font-bold dark:bg-sky-950 dark:text-sky-300';
                      if (p === 'High') style = 'bg-amber-50 border-amber-400 text-amber-700 font-bold dark:bg-amber-950 dark:text-amber-300';
                      if (p === 'Urgent') style = 'bg-rose-50 border-rose-500 text-rose-700 font-bold dark:bg-rose-950 dark:text-rose-300 ring-2 ring-rose-400/30';
                    }
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`rounded-xl border py-2 text-center text-xs transition-colors ${style}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Attach Photo (Optional)
                </label>
                {imagePreview ? (
                  <div className="relative h-20 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="absolute top-1.5 right-1.5 rounded-full bg-rose-600 p-1 text-white shadow-md hover:bg-rose-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors">
                    <UploadCloud className="h-5 w-5 text-slate-400" />
                    <span className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Upload photo (Max 5MB)
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering Ticket...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
