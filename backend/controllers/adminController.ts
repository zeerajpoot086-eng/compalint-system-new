import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAdminUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await db.getUsers();
    const complaints = await db.getComplaints();

    const usersWithStats = users.map(u => {
      const userComplaints = complaints.filter(c => c.userId === u._id || c.userId === u.id);
      const userObj = { ...u };
      delete userObj.password;
      return {
        ...userObj,
        totalComplaints: userComplaints.length,
        pendingComplaints: userComplaints.filter(c => c.status === 'Pending').length,
        completedComplaints: userComplaints.filter(c => c.status === 'Completed').length
      };
    });

    res.json({ success: true, users: usersWithStats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      priority,
      status,
      technicianId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10'
    } = req.query as Record<string, string>;

    let list = await db.getComplaints();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.complaintId.toLowerCase().includes(q) ||
        c.userName.toLowerCase().includes(q) ||
        c.userEmail.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      list = list.filter(c => c.category === category);
    }

    if (priority && priority !== 'All') {
      list = list.filter(c => c.priority === priority);
    }

    if (status && status !== 'All') {
      list = list.filter(c => c.status === status);
    }

    if (technicianId && technicianId !== 'All') {
      list = list.filter(c => c.assignedTechnicianId === technicianId);
    }

    // Sort
    list.sort((a: any, b: any) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const total = list.length;
    const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      complaints: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      status,
      priority,
      assignedTechnicianId,
      adminNote
    } = req.body;

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;

    if (assignedTechnicianId !== undefined) {
      if (assignedTechnicianId === '' || assignedTechnicianId === null) {
        updates.assignedTechnicianId = '';
        updates.assignedTechnicianName = '';
        updates.assignedTechnicianPhone = '';
        if (complaint.status === 'Assigned') {
          updates.status = 'Pending';
        }
      } else {
        const tech = await db.getTechnicianById(assignedTechnicianId);
        if (tech) {
          updates.assignedTechnicianId = tech._id;
          updates.assignedTechnicianName = tech.name;
          updates.assignedTechnicianPhone = tech.phone;
          if (complaint.status === 'Pending') {
            updates.status = 'Assigned';
          }
        }
      }
    }

    if (adminNote) {
      const workNotes = complaint.workNotes || [];
      workNotes.push({
        id: 'note_' + Math.random().toString(36).substring(2, 9),
        author: req.user?.name || 'Admin',
        role: 'admin',
        note: adminNote,
        timestamp: new Date().toISOString()
      });
      updates.workNotes = workNotes;
    }

    const updated = await db.updateComplaint(complaint._id, updates);
    res.json({ success: true, message: 'Complaint updated by administrator', complaint: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    await db.deleteComplaint(complaint._id);
    res.json({
      success: true,
      message: `Inappropriate complaint ${complaint.complaintId} was permanently deleted by admin.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await db.getUsers();
    const complaints = await db.getComplaints();
    const technicians = await db.getTechnicians();

    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalComplaints = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const assigned = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const completed = complaints.filter(c => c.status === 'Completed').length;
    const cancelled = complaints.filter(c => c.status === 'Cancelled').length;
    const urgent = complaints.filter(c => c.priority === 'Urgent').length;

    // Category Distribution
    const categoryCounts: Record<string, number> = {};
    const categories = ['Electrician', 'Plumber', 'AC Repair', 'Internet/WiFi', 'Computer/Laptop', 'Appliance Repair', 'Other'];
    categories.forEach(cat => { categoryCounts[cat] = 0; });
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const categoryData = Object.keys(categoryCounts).map(name => ({
      name,
      count: categoryCounts[name]
    }));

    // Status Distribution
    const statusData = [
      { name: 'Pending', count: pending, color: '#f59e0b' },
      { name: 'Assigned', count: assigned, color: '#3b82f6' },
      { name: 'In Progress', count: inProgress, color: '#8b5cf6' },
      { name: 'Completed', count: completed, color: '#10b981' },
      { name: 'Cancelled', count: cancelled, color: '#ef4444' }
    ];

    // Priority Distribution
    const priorityData = [
      { name: 'Low', count: complaints.filter(c => c.priority === 'Low').length, color: '#94a3b8' },
      { name: 'Medium', count: complaints.filter(c => c.priority === 'Medium').length, color: '#38bdf8' },
      { name: 'High', count: complaints.filter(c => c.priority === 'High').length, color: '#f97316' },
      { name: 'Urgent', count: complaints.filter(c => c.priority === 'Urgent').length, color: '#ef4444' }
    ];

    // Monthly Activity Trend (Simulated 6 month breakdown)
    const monthlyTrend = [
      { month: 'Apr', complaints: 18, resolved: 16 },
      { month: 'May', complaints: 24, resolved: 22 },
      { month: 'Jun', complaints: 32, resolved: 29 },
      { month: 'Jul', complaints: 45, resolved: 41 },
      { month: 'Aug', complaints: 58, resolved: 53 },
      { month: 'Sep', complaints: totalComplaints, resolved: completed }
    ];

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        pending,
        assigned,
        inProgress,
        completed,
        cancelled,
        urgent,
        totalTechnicians: technicians.length,
        avgResolutionRate: totalComplaints ? Math.round((completed / totalComplaints) * 100) : 100,
        categoryData,
        statusData,
        priorityData,
        monthlyTrend
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminTechnicians = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const technicians = await db.getTechnicians();
    res.json({ success: true, technicians });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminTechnician = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, specialization, experienceYears } = req.body;
    if (!name || !email || !phone || !specialization) {
      res.status(400).json({ success: false, message: 'All technician details are required.' });
      return;
    }

    const newTech = await db.createTechnician({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialization,
      experienceYears: Number(experienceYears) || 1,
      rating: 5.0,
      totalResolved: 0,
      activeJobs: 0,
      isAvailable: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({ success: true, message: 'Technician registered successfully', technician: newTech });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
