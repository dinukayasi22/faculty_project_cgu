import { Router } from 'express';
import { getAllJobs, getJobDetails } from '../controllers/jobController.js';

const router = Router();

// Public routes (no authentication required)
router.get('/', getAllJobs);
router.get('/:jobId', getJobDetails);

export default router;
