import {
  User,
  Complaint,
  Technician,
  NotificationItem,
  DashboardStats,
  AdminStats,
  AIAnalysis
} from '../types';

const API_BASE = 'https://compalint-system-new-1.onrender.com/api';

// Helper for making authenticated requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('fixmate_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    register: (userData: { name: string; email: string; phone: string; password: string; role?: string }) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    getMe: () =>
      request<{ success: boolean; user: User }>('/auth/me'),

    updateProfile: (profileData: { name?: string; phone?: string; avatar?: string }) =>
      request<{ success: boolean; message: string; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),

    changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
      request<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords)
      })
  },

  // Complaints
  complaints: {
    getAll: (params: {
      search?: string;
      category?: string;
      priority?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
      return request<{
        success: boolean;
        complaints: Complaint[];
        stats: DashboardStats;
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/complaints?${query.toString()}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; complaint: Complaint }>(`/complaints/${id}`),

    create: (complaintData: {
      category: string;
      description: string;
      location: string;
      preferredDate: string;
      imageUrl?: string;
      priority?: string;
      aiAnalysis?: AIAnalysis;
    }) =>
      request<{ success: boolean; message: string; complaint: Complaint; complaintId: string }>('/complaints', {
        method: 'POST',
        body: JSON.stringify(complaintData)
      }),

    update: (id: string, updates: Partial<Complaint>) =>
      request<{ success: boolean; message: string; complaint: Complaint }>(`/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/complaints/${id}`, {
        method: 'DELETE'
      })
  },

  // AI Smart Analysis
  ai: {
    analyze: (description: string) =>
      request<{ success: boolean; analysis: AIAnalysis; source: string }>('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ description })
      })
  },

  // Admin APIs
  admin: {
    getStats: () =>
      request<{ success: boolean; stats: AdminStats }>('/admin/stats'),

    getUsers: () =>
      request<{ success: boolean; users: User[] }>('/admin/users'),

    getComplaints: (params: {
      search?: string;
      category?: string;
      priority?: string;
      status?: string;
      technicianId?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
      return request<{
        success: boolean;
        complaints: Complaint[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/admin/complaints?${query.toString()}`);
    },

    updateComplaint: (id: string, data: {
      status?: string;
      priority?: string;
      assignedTechnicianId?: string;
      adminNote?: string;
    }) =>
      request<{ success: boolean; message: string; complaint: Complaint }>(`/admin/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    deleteComplaint: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/complaints/${id}`, {
        method: 'DELETE'
      }),

    getTechnicians: () =>
      request<{ success: boolean; technicians: Technician[] }>('/admin/technicians'),

    createTechnician: (techData: {
      name: string;
      email: string;
      phone: string;
      specialization: string;
      experienceYears: number;
    }) =>
      request<{ success: boolean; message: string; technician: Technician }>('/admin/technicians', {
        method: 'POST',
        body: JSON.stringify(techData)
      })
  },

  // Technician APIs
  technician: {
    getAssignedComplaints: () =>
      request<{
        success: boolean;
        complaints: Complaint[];
        technicianProfile: any;
        stats: {
          totalAssigned: number;
          inProgress: number;
          pendingAction: number;
          completed: number;
          rating: number;
          totalResolvedOverall: number;
        };
      }>('/technician/complaints'),

    updateComplaint: (id: string, data: {
      status?: string;
      workNote?: string;
      partsUsed?: string;
      resolutionSummary?: string;
    }) =>
      request<{ success: boolean; message: string; complaint: Complaint }>(`/technician/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  // Notifications
  notifications: {
    getAll: () =>
      request<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }>('/notifications'),

    markAsRead: (id: string) =>
      request<{ success: boolean; message: string }>(`/notifications/${id}/read`, {
        method: 'PUT'
      }),

    markAllAsRead: () =>
      request<{ success: boolean; message: string }>('/notifications/read-all', {
        method: 'PUT'
      })
  }
};
