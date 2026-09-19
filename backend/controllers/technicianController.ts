import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getTechnicianComplaints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find technician profile
    const allTechs = await db.getTechnicians();
    const tech = allTechs.find(t => t.userId === user._id || t.userId === user.id || t.email.toLowerCase() === user.email.toLowerCase());

    const allComplaints = await db.getComplaints();
    
    // Filter complaints assigned to this technician
    const assigned = allComplaints.filter(c => 
      (tech && (c.assignedTechnicianId === tech._id || c.assignedTechnicianId === tech.id)) ||
      c.assignedTechnicianName?.toLowerCase() === user.name.toLowerCase()
    );

    const stats = {
      totalAssigned: assigned.length,
      inProgress: assigned.filter(c => c.status === 'In Progress').length,
      pendingAction: assigned.filter(c => c.status === 'Assigned').length,
      completed: assigned.filter(c => c.status === 'Completed').length,
      rating: tech?.rating || 4.9,
      totalResolvedOverall: tech?.totalResolved || 0
    };

    res.json({
      success: true,
      complaints: assigned,
      technicianProfile: tech || {
        name: user.name,
        email: user.email,
        phone: user.phone,
        specialization: 'General Technician',
        rating: 4.9
      },
      stats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTechnicianComplaint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, workNote, partsUsed, resolutionSummary } = req.body;
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

    const updates: any = {};
    if (status) {
      updates.status = status;
    }

    if (resolutionSummary) {
      updates.resolutionSummary = resolutionSummary.trim();
    }

    if (workNote) {
      const notes = complaint.workNotes || [];
      notes.push({
        id: 'wn_' + Math.random().toString(36).substring(2, 9),
        author: user.name,
        role: 'technician',
        note: workNote.trim(),
        partsUsed: partsUsed ? partsUsed.trim() : undefined,
        timestamp: new Date().toISOString()
      });
      updates.workNotes = notes;
    }

    const updated = await db.updateComplaint(complaint._id, updates);
    res.json({
      success: true,
      message: `Complaint ${complaint.complaintId} updated successfully.`,
      complaint: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
