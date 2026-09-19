export type UserRole = 'user' | 'admin' | 'technician';

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  totalComplaints?: number;
  pendingComplaints?: number;
  completedComplaints?: number;
}

export type ComplaintCategory =
  | 'Electrician'
  | 'Plumber'
  | 'AC Repair'
  | 'Internet/WiFi'
  | 'Computer/Laptop'
  | 'Appliance Repair'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface WorkNote {
  id: string;
  author: string;
  role: string;
  note: string;
  timestamp: string;
  partsUsed?: string;
}

export interface AIAnalysis {
  suggestedCategory: ComplaintCategory;
  suggestedPriority: ComplaintPriority;
  problemSummary: string;
  suggestedNextStep: string;
  confidenceScore?: number;
  tags?: string[];
  isAiGenerated?: boolean;
}

export interface Complaint {
  _id: string;
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  preferredDate: string;
  imageUrl?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  aiAnalysis?: AIAnalysis;
  timeline: TimelineEvent[];
  workNotes?: WorkNote[];
  resolutionSummary?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  _id: string;
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  totalResolved: number;
  activeJobs: number;
  isAvailable: boolean;
  avatar?: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'assignment' | 'status_change';
  complaintId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  urgent: number;
}

export interface AdminStats {
  totalUsers: number;
  totalComplaints: number;
  pending: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  urgent: number;
  totalTechnicians: number;
  avgResolutionRate: number;
  categoryData: { name: string; count: number }[];
  statusData: { name: string; count: number; color: string }[];
  priorityData: { name: string; count: number; color: string }[];
  monthlyTrend: { month: string; complaints: number; resolved: number }[];
}
