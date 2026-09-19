import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      search,
      category,
      priority,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10'
    } = req.query as Record<string, string>;

    let allComplaints = await db.getComplaints();

    // If regular user, restrict to their complaints
    if (user.role === 'user') {
      allComplaints = allComplaints.filter(c => c.userId === user._id || c.userId === user.id);
    } else if (user.role === 'technician') {
      // Find technician record or filter by technician assignment
      const tech = (await db.getTechnicians()).find(t => t.userId === user._id || t.userId === user.id || t.email === user.email);
      if (tech) {
        allComplaints = allComplaints.filter(c => c.assignedTechnicianId === tech._id || c.assignedTechnicianId === tech.id);
      }
    }

    // Apply Filters
    if (search) {
      const q = search.toLowerCase();
      allComplaints = allComplaints.filter(c =>
        c.complaintId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.userName && c.userName.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      allComplaints = allComplaints.filter(c => c.category === category);
    }

    if (priority && priority !== 'All') {
      allComplaints = allComplaints.filter(c => c.priority === priority);
    }

    if (status && status !== 'All') {
      allComplaints = allComplaints.filter(c => c.status === status);
    }

    // Sorting
    allComplaints.sort((a: any, b: any) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const total = allComplaints.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allComplaints.slice(startIndex, startIndex + limitNum);

    // Calculate Summary Counts for dashboard
    const rawUserComplaints = user.role === 'user'
      ? (await db.getComplaints()).filter(c => c.userId === user._id || c.userId === user.id)
      : allComplaints;

    const stats = {
      total: rawUserComplaints.length,
      pending: rawUserComplaints.filter(c => c.status === 'Pending').length,
      inProgress: rawUserComplaints.filter(c => c.status === 'In Progress').length,
      completed: rawUserComplaints.filter(c => c.status === 'Completed').length,
      urgent: rawUserComplaints.filter(c => c.priority === 'Urgent').length
    };

    res.json({
      success: true,
      complaints: paginated,
      stats,
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

export const getComplaintById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    // Access check
    if (user.role === 'user' && complaint.userId !== user._id && complaint.userId !== user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this complaint.' });
      return;
    }

    res.json({ success: true, complaint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      category,
      description,
      location,
      preferredDate,
      imageUrl,
      priority = 'Medium',
      aiAnalysis
    } = req.body;

    if (!category || !description || !location || !preferredDate) {
      res.status(400).json({
        success: false,
        message: 'Category, description, location, and preferred date are required.'
      });
      return;
    }

    const newComplaint = await db.createComplaint({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      category,
      description,
      location,
      preferredDate,
      imageUrl: imageUrl || '',
      priority: priority || 'Medium',
      status: 'Pending',
      aiAnalysis
    });

    res.status(201).json({
      success: true,
      message: `Complaint registered successfully with ID: ${newComplaint.complaintId}`,
      complaint: newComplaint,
      complaintId: newComplaint.complaintId
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    // Regular users can only cancel their own pending complaints or submit rating/feedback
    if (user.role === 'user') {
      if (complaint.userId !== user._id && complaint.userId !== user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { status, rating, feedback } = req.body;
      const allowedUpdates: any = {};
      if (status === 'Cancelled' && complaint.status === 'Pending') {
        allowedUpdates.status = 'Cancelled';
      }
      if (typeof rating === 'number') {
        allowedUpdates.rating = Math.max(1, Math.min(5, rating));
      }
      if (feedback) {
        allowedUpdates.feedback = feedback.trim();
      }

      const updated = await db.updateComplaint(complaint._id, allowedUpdates);
      res.json({ success: true, message: 'Complaint updated', complaint: updated });
      return;
    }

    // Admin or technician updates
    const updated = await db.updateComplaint(complaint._id, req.body);
    res.json({ success: true, message: 'Complaint updated successfully', complaint: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    // Allow user to delete only if Pending, or Admin anytime
    if (user.role === 'user') {
      if (complaint.userId !== user._id && complaint.userId !== user.id) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      if (complaint.status !== 'Pending') {
        res.status(400).json({ success: false, message: 'Cannot delete a complaint that is already in progress or completed.' });
        return;
      }
    }

    await db.deleteComplaint(complaint._id);
    res.json({ success: true, message: `Complaint ${complaint.complaintId} has been removed.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
