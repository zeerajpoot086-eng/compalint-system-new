import { Router } from 'express';
import {
  getAdminUsers,
  getAdminComplaints,
  updateAdminComplaint,
  deleteAdminComplaint,
  getAdminStats,
  getAdminTechnicians,
  createAdminTechnician
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/complaints', getAdminComplaints);
router.put('/complaints/:id', updateAdminComplaint);
router.delete('/complaints/:id', deleteAdminComplaint);
router.get('/technicians', getAdminTechnicians);
router.post('/technicians', createAdminTechnician);

export default router;
