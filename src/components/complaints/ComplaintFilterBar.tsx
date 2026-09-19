import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../../types';

interface ComplaintFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Categories', value: '' },
  { label: 'Electrician', value: 'Electrician' },
  { label: 'Plumber', value: 'Plumber' },
  { label: 'AC Repair', value: 'AC Repair' },
  { label: 'Internet/WiFi', value: 'Internet/WiFi' },
  { label: 'Computer/Laptop', value: 'Computer/Laptop' },
  { label: 'Appliance Repair', value: 'Appliance Repair' },
  { label: 'Other', value: 'Other' }
];

const STATUSES: { label: string; value: string }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const PRIORITIES: { label: string; value: string }[] = [
  { label: 'All Priorities', value: '' },
  { label: 'Urgent', value: 'Urgent' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
];

export const ComplaintFilterBar: React.FC<ComplaintFilterBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search Bar */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ticket ID, keyword, address..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:focus:bg-slate-900"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:focus:bg-slate-900"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:focus:bg-slate-900"
          >
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Filter Chips / Active Counts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Filter className="h-3 w-3 text-indigo-500" />
          <span>Quick Filters:</span>
          {(['Pending', 'In Progress', 'Completed'] as ComplaintStatus[]).map(st => (
            <button
              key={st}
              onClick={() => setStatus(status === st ? '' : st)}
              className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                status === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={() => setPriority(priority === 'Urgent' ? '' : 'Urgent')}
            className={`rounded-lg px-2 py-0.5 text-[11px] font-bold transition-colors ${
              priority === 'Urgent'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            🔥 Urgent
          </button>
        </div>

        {/* Sort option */}
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <ArrowUpDown className="h-3 w-3" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="createdAt" className="dark:bg-slate-900">Newest Created</option>
            <option value="preferredDate" className="dark:bg-slate-900">Preferred Visit Date</option>
            <option value="priority" className="dark:bg-slate-900">Priority Level</option>
            <option value="status" className="dark:bg-slate-900">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
};
