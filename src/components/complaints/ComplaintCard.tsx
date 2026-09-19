import React from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';
import {
  Zap,
  Droplets,
  Wind,
  Wifi,
  Laptop,
  Hammer,
  HelpCircle,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  User,
  AlertTriangle
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onSelect: (complaint: Complaint) => void;
}

const CATEGORY_ICONS: Record<string, { icon: any; bg: string; text: string }> = {
  Electrician: { icon: Zap, bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400' },
  Plumber: { icon: Droplets, bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-400' },
  'AC Repair': { icon: Wind, bg: 'bg-cyan-50 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400' },
  'Internet/WiFi': { icon: Wifi, bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400' },
  'Computer/Laptop': { icon: Laptop, bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400' },
  'Appliance Repair': { icon: Hammer, bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400' },
  Other: { icon: HelpCircle, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' }
};

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onSelect }) => {
  const catMeta = CATEGORY_ICONS[complaint.category] || CATEGORY_ICONS['Other'];
  const Icon = catMeta.icon;

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800';
      case 'Assigned':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 font-bold border-rose-300 dark:bg-rose-950 dark:text-rose-400';
      case 'High':
        return 'bg-amber-50 text-amber-700 font-semibold border-amber-300 dark:bg-amber-950 dark:text-amber-400';
      case 'Medium':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div
      onClick={() => onSelect(complaint)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer"
    >
      <div>
        
        {/* Top Header: Category + Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${catMeta.bg} ${catMeta.text}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {complaint.complaintId}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {complaint.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`inline-flex items-center rounded-md border px-1.5 py-0.2 text-[10px] uppercase font-semibold ${getPriorityBadge(complaint.priority)}`}>
              {complaint.priority}
            </span>
          </div>
        </div>

        {/* Problem Description */}
        <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        {/* AI Insight Badge if present */}
        {complaint.aiAnalysis && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-indigo-50/70 px-2.5 py-1.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{complaint.aiAnalysis.problemSummary}</span>
          </div>
        )}

      </div>

      {/* Card Bottom Meta */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
            <span>{complaint.preferredDate}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
