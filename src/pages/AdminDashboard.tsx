import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { AdminStats, Complaint, Technician, User, ComplaintStatus, ComplaintPriority } from '../types';
import { ComplaintDetailsModal } from '../components/complaints/ComplaintDetailsModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  Shield,
  Users,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  UserCheck,
  PlusCircle,
  Trash2,
  Edit,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Loader2,
  X
} from 'lucide-react';

const COLORS = ['#6366F1', '#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#64748B'];

export const AdminDashboard: React.FC = () => {
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'complaints' | 'users' | 'technicians'>('complaints');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters for Admin Complaints
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Selected complaint for view/edit
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Quick Dispatch / Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState<Complaint | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Add New Technician Modal
  const [newTechModalOpen, setNewTechModalOpen] = useState(false);
  const [techName, setTechName] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techSpecialization, setTechSpecialization] = useState('Electrician');
  const [techExp, setTechExp] = useState(3);
  const [isCreatingTech, setIsCreatingTech] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, complaintsRes, usersRes, techsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getComplaints({
          search,
          category: categoryFilter,
          status: statusFilter,
          priority: priorityFilter,
          limit: 50
        }),
        api.admin.getUsers(),
        api.admin.getTechnicians()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (complaintsRes.success) setComplaints(complaintsRes.complaints);
      if (usersRes.success) setUsersList(usersRes.users);
      if (techsRes.success) setTechnicians(techsRes.technicians);
    } catch (err: any) {
      showToast('Error loading admin data: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search, categoryFilter, statusFilter, priorityFilter]);

  // Handle Quick Status Change
  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      await api.admin.updateComplaint(complaintId, { status: newStatus });
      showToast(`Status updated to ${newStatus}`, 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  // Handle Delete Complaint
  const handleDeleteComplaint = async (complaintId: string, ticketNum: string) => {
    if (!window.confirm(`Are you sure you want to remove ticket ${ticketNum}?`)) return;

    try {
      await api.admin.deleteComplaint(complaintId);
      showToast(`Complaint ${ticketNum} deleted`, 'info');
      fetchAdminData();
    } catch (err: any) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  // Handle Dispatch / Assign Technician
  const handleAssignTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetComplaint || !selectedTechId) return;

    setIsAssigning(true);
    try {
      await api.admin.updateComplaint(targetComplaint._id || targetComplaint.id, {
        assignedTechnicianId: selectedTechId,
        status: 'Assigned'
      });
      showToast(`Technician assigned to ${targetComplaint.complaintId}!`, 'success');
      setAssignModalOpen(false);
      setTargetComplaint(null);
      fetchAdminData();
    } catch (err: any) {
      showToast('Assignment failed: ' + err.message, 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  // Handle Add Technician
  const handleCreateTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName || !techEmail || !techPhone) {
      showToast('Please fill all technician fields', 'warning');
      return;
    }

    setIsCreatingTech(true);
    try {
      await api.admin.createTechnician({
        name: techName.trim(),
        email: techEmail.trim(),
        phone: techPhone.trim(),
        specialization: techSpecialization,
        experienceYears: Number(techExp) || 2
      });

      showToast(`Technician ${techName} registered to fleet!`, 'success');
      setNewTechModalOpen(false);
      setTechName('');
      setTechEmail('');
      setTechPhone('');
      fetchAdminData();
    } catch (err: any) {
      showToast('Failed to create technician: ' + err.message, 'error');
    } finally {
      setIsCreatingTech(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrator Command Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global dispatch controls, performance metrics, technician workloads, and user database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAdminData()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Console</span>
          </button>

          <button
            onClick={() => setNewTechModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Technician</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-400">Total Tickets</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.totalComplaints}</div>
            <div className="text-[10px] text-indigo-500 font-medium mt-0.5">Across all categories</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-950 dark:bg-amber-950/20">
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Pending Dispatch</div>
            <div className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-200">{stats.pending}</div>
            <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Requires assignment</div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4 dark:border-sky-950 dark:bg-sky-950/20">
            <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">In Progress</div>
            <div className="mt-1 text-2xl font-bold text-sky-900 dark:text-sky-200">{stats.inProgress + stats.assigned}</div>
            <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">Active tech field jobs</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Resolved</div>
            <div className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-200">{stats.completed}</div>
            <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">{stats.avgResolutionRate}% rate</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-400">Active Technicians</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTechnicians}</div>
            <div className="text-[10px] text-emerald-500 font-medium mt-0.5">100% Certified</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-400">Registered Users</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</div>
            <div className="text-[10px] text-indigo-500 font-medium mt-0.5">Customers & Staff</div>
          </div>

        </div>
      )}

      {/* Interactive Recharts Analytics Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Complaints Trend Chart */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Monthly Complaints & Resolution Flow
                </h3>
                <p className="text-[11px] text-slate-400">Reported issues vs completed on-site repairs</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Line type="monotone" dataKey="complaints" name="Incoming Complaints" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved Tickets" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Complaints by Category
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Breakdown of technical service areas</p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Admin Tabbed Workspace */}
      <div className="space-y-4">
        
        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'complaints'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Master Complaints Dispatch ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('technicians')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'technicians'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Technicians Fleet ({technicians.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Directory ({usersList.length})</span>
          </button>
        </div>

        {/* TAB 1: COMPLAINTS MASTER TABLE */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter ticket ID, user, address..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Categories</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Internet/WiFi">Internet/WiFi</option>
                <option value="Computer/Laptop">Computer/Laptop</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Complaints Master Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Assigned Tech</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status & Action</th>
                      <th className="py-3 px-4 text-right">Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {complaints.map(c => (
                      <tr key={c._id || c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {c.complaintId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{c.userName}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{c.location}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {c.category}
                        </td>
                        <td className="py-3 px-4">
                          {c.assignedTechnicianName ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                              <UserCheck className="h-3.5 w-3.5" />
                              {c.assignedTechnicianName}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setTargetComplaint(c);
                                setSelectedTechId(technicians[0]?._id || technicians[0]?.id || '');
                                setAssignModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 cursor-pointer"
                            >
                              <PlusCircle className="h-3 w-3" />
                              Assign Tech
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            c.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={c.status}
                            onChange={e => handleStatusChange(c._id || c.id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setIsDetailsOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
                              title="Inspect Ticket Details"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComplaint(c._id || c.id, c.complaintId)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                              title="Delete Complaint"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TECHNICIANS FLEET */}
        {activeTab === 'technicians' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map(t => (
              <div
                key={t._id || t.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`}
                      alt={t.name}
                      className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</h4>
                      <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {t.specialization}
                      </span>
                    </div>
                  </div>

                  <span className={`h-2.5 w-2.5 rounded-full ${t.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} title={t.isAvailable ? 'Available for dispatch' : 'Busy'} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50/70 rounded-2xl dark:bg-slate-800/40">
                  <div>
                    <div className="text-[10px] text-slate-400">Rating</div>
                    <div className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                      <Award className="h-3 w-3" />
                      {t.rating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Resolved</div>
                    <div className="font-bold text-slate-900 dark:text-white">{t.totalResolved}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Active Jobs</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{t.activeJobs}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Email: <strong className="text-slate-700 dark:text-slate-300">{t.email}</strong></div>
                  <div>Phone: <strong className="text-slate-700 dark:text-slate-300">{t.phone}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: USER DIRECTORY */}
        {activeTab === 'users' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map(u => (
                    <tr key={u._id || u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="py-3 px-4 text-slate-500">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : u.role === 'technician'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Assign Technician Modal */}
      {assignModalOpen && targetComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dispatch Technician to Ticket {targetComplaint.complaintId}
              </h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800 space-y-1">
              <div><strong>Category:</strong> {targetComplaint.category}</div>
              <div><strong>Problem:</strong> {targetComplaint.description}</div>
              <div><strong>Location:</strong> {targetComplaint.location}</div>
            </div>

            <form onSubmit={handleAssignTechnician} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Available Technician</label>
                <select
                  value={selectedTechId}
                  onChange={e => setSelectedTechId(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {technicians.map(t => (
                    <option key={t._id || t.id} value={t._id || t.id}>
                      {t.name} — {t.specialization} ({t.rating}★, {t.activeJobs} active jobs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  {isAssigning ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Technician Modal */}
      {newTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Register New Certified Technician
              </h3>
              <button onClick={() => setNewTechModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTech} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  placeholder="e.g. Liam Foster"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={techEmail}
                  onChange={e => setTechEmail(e.target.value)}
                  placeholder="liam.tech@fixmate.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    required
                    value={techPhone}
                    onChange={e => setTechPhone(e.target.value)}
                    placeholder="+1 (555) 482-1920"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience (Yrs)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={techExp}
                    onChange={e => setTechExp(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Specialization</label>
                <select
                  value={techSpecialization}
                  onChange={e => setTechSpecialization(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Electrician">Electrician & Wiring</option>
                  <option value="Plumber">Plumber & Drainage</option>
                  <option value="AC Repair">AC & HVAC Overhaul</option>
                  <option value="Internet/WiFi">Internet & Fiber Networks</option>
                  <option value="Computer/Laptop">Computers & Workstations</option>
                  <option value="Appliance Repair">Appliance & Smart Hardware</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTechModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTech}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  {isCreatingTech ? 'Adding...' : 'Add to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Inspection Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={fetchAdminData}
      />

    </div>
  );
};
