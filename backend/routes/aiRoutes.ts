import { Router } from 'express';
import { analyzeComplaintAI } from '../controllers/aiController.js';

const router = Router();

// Modular AI analysis route (can be called before or after authentication)
router.post('/analyze', analyzeComplaintAI);

export default router;
