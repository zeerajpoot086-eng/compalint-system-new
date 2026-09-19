import { Router } from 'express';
import {
  getTechnicianComplaints,
  updateTechnicianComplaint
} from '../controllers/technicianController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['technician', 'admin']));

router.get('/complaints', getTechnicianComplaints);
router.put('/complaints/:id', updateTechnicianComplaint);

export default router;
