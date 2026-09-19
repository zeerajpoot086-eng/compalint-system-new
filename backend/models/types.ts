export interface IUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin' | 'technician';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComplaint {
  _id: string;
  id: string;
  complaintId: string; // e.g. "FIX-2026-0042"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: 'Electrician' | 'Plumber' | 'AC Repair' | 'Internet/WiFi' | 'Computer/Laptop' | 'Appliance Repair' | 'Other';
  description: string;
  location: string;
  preferredDate: string;
  imageUrl?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  aiAnalysis?: {
    suggestedCategory: string;
    suggestedPriority: 'Low' | 'Medium' | 'High' | 'Urgent';
    problemSummary: string;
    suggestedNextStep: string;
    confidenceScore?: number;
    tags?: string[];
  };
  timeline: {
    id: string;
    status: string;
    title: string;
    description: string;
    timestamp: string;
    performedBy: string;
  }[];
  workNotes?: {
    id: string;
    author: string;
    role: string;
    note: string;
    timestamp: string;
    partsUsed?: string;
  }[];
  resolutionSummary?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITechnician {
  _id: string;
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: 'Electrician' | 'Plumber' | 'AC Repair' | 'Internet/WiFi' | 'Computer/Laptop' | 'Appliance Repair' | 'General Maintenance' | 'Other';
  experienceYears: number;
  rating: number;
  totalResolved: number;
  activeJobs: number;
  isAvailable: boolean;
  avatar?: string;
  createdAt: string;
}

export interface INotification {
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
